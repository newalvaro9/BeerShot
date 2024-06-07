# Get all JavaScript and TypeScript files excluding "node_modules", "build", and ".next" directories
$files = Get-ChildItem -Recurse -Include *.js, *.ts, *.jsx, *.tsx -Exclude node_modules, build, .next

# Loop through the files and open them with a delay of 750ms
foreach ($file in $files) {
    # Check if the file is within the excluded directories
    if ($file.FullName -notmatch "\\node_modules\\|\\build\\|\\.next\\") {
        code -n $file.FullName --reuse-window
        Start-Sleep -Milliseconds 750
    }
}