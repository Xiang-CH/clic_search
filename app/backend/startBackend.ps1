Write-Host ""
Write-Host "Loading azd .env file from current environment"
Write-Host ""

$envValues = azd env get-values

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to load environment variables from azd environment"
    exit $LASTEXITCODE
}

$envValues | ForEach-Object {
    $key, $value = $_ -split '=', 2
    $value = $value -replace '^"', '' -replace '"$', ''
    Set-Item -Path "Env:\$key" -Value $value
}

Write-Host 'Creating python virtual environment "backend_env"'
python -m venv backend_env

Write-Host ""
Write-Host "Restoring backend python packages"
Write-Host ""

& .\backend_env\Scripts\python.exe -m pip install --upgrade pip
& .\backend_env\Scripts\python.exe -m pip install -r requirements.txt

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to restore backend python packages"
    exit $LASTEXITCODE
}

Write-Host ""
Write-Host "Starting backend"
Write-Host ""

& .\backend_env\Scripts\python.exe .\main.py

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to start backend"
    exit $LASTEXITCODE
}

# Start-Process "http://127.0.0.1:5000"