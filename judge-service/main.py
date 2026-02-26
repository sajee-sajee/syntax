import os
import subprocess
import tempfile
import time
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title="Code Reality Judge Service")

class TestCase(BaseModel):
    input: str
    expectedOutput: str

class JudgeRequest(BaseModel):
    language: str
    code: str
    testCases: List[TestCase]
    timeLimitMs: int = 2000
    memoryLimitMb: int = 256

class JudgeResult(BaseModel):
    status: str
    testsPassed: int
    testsTotal: int
    execTimeMs: int
    memoryMb: int
    errorMessage: Optional[str] = None

@app.get("/health")
def health_check():
    return {"status": "ok"}

def execute_python_code(code: str, test_cases: List[TestCase], timeout_sec: float) -> JudgeResult:
    tests_passed = 0
    total_tests = len(test_cases)
    overall_exec_time = 0.0
    error_msg = None

    with tempfile.TemporaryDirectory() as temp_dir:
        # Write user code
        user_code_path = os.path.join(temp_dir, "user_code.py")
        with open(user_code_path, "w") as f:
            f.write(code)

        # Write runner code
        runner_code = """
import sys
import json
import inspect
import user_code

try:
    functions = [f for name, f in inspect.getmembers(user_code, inspect.isfunction) if f.__module__ == 'user_code']
    if not functions:
        print("Error: No function defined in code", file=sys.stderr)
        sys.exit(1)
    
    input_data = json.loads(sys.argv[1])
    result = functions[-1](input_data) # use the last defined function
    print(json.dumps(result))
except Exception as e:
    print(str(e), file=sys.stderr)
    sys.exit(1)
"""
        runner_path = os.path.join(temp_dir, "runner.py")
        with open(runner_path, "w") as f:
            f.write(runner_code)

        # Run tests
        for tc in test_cases:
            try:
                start_time = time.time()
                proc = subprocess.run(
                    ["python3", runner_path, tc.input],
                    capture_output=True,
                    text=True,
                    timeout=timeout_sec
                )
                exec_time = time.time() - start_time
                overall_exec_time += exec_time

                if proc.returncode != 0:
                    status = "error"
                    error_msg = proc.stderr.strip()
                    break

                output = proc.stdout.strip()
                # Parse output to match expected JSON representation (standardize formatting)
                import sys
                try:
                    out_parsed = json.loads(output)
                    expected_parsed = json.loads(tc.expectedOutput)
                    if out_parsed == expected_parsed:
                        tests_passed += 1
                    else:
                        error_msg = f"Got: {output}, Expected: {tc.expectedOutput}"
                        status = "wrong_answer"
                        break
                except:
                    # Fallback to string comparison, ignoring whitespace differences
                    stripped_out = output.replace(" ", "")
                    stripped_expected = tc.expectedOutput.replace(" ", "")
                    if stripped_out == stripped_expected:
                        tests_passed += 1
                    else:
                        import sys
                        error_msg = f"Got: {output}, Expected: {tc.expectedOutput}"
                        status = "wrong_answer"
                        break
            except subprocess.TimeoutExpired:
                status = "tle"
                break
            except Exception as e:
                status = "error"
                error_msg = str(e)
                break
        
        status = "accepted" if tests_passed == total_tests else (status if 'status' in locals() else "wrong_answer")

    return JudgeResult(
        status=status,
        testsPassed=tests_passed,
        testsTotal=total_tests,
        execTimeMs=int(overall_exec_time * 1000),
        memoryMb=0, # Memory tracking mocked for now
        errorMessage=error_msg
    )

@app.post("/judge", response_model=JudgeResult)
def judge(request: JudgeRequest):
    if request.language == "python":
        return execute_python_code(request.code, request.testCases, request.timeLimitMs / 1000.0)
    
    return JudgeResult(
        status="error",
        testsPassed=0,
        testsTotal=len(request.testCases),
        execTimeMs=0,
        memoryMb=0,
        errorMessage=f"Language {request.language} not supported yet."
    )
