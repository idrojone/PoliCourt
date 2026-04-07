$line = netstat -ano | findstr ":4001"
if ($line) {
    $parts = $line -split '\s+'
    $p = $parts[-1]
    Write-Output "Killing PID $p"
    taskkill /PID $p /F
} else {
    Write-Output "No process on 4001"
}
