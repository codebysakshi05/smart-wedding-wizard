$base = "public\wedding-data"
$dirs = @("data","engine","configs","metadata","assets\venues","assets\styles","assets\decor","assets\mandap","assets\stage","assets\photography","assets\food","assets\makeup","assets\jewelry","assets\outfits","assets\invitations","assets\entertainment","assets\ideas","assets\services")
foreach ($d in $dirs) {
    New-Item -ItemType Directory -Force -Path "$base\$d" | Out-Null
}
# .gitkeep stubs
foreach ($d in (Get-ChildItem -Path "$base\assets" -Directory)) {
    New-Item -ItemType File -Force -Path "$($d.FullName)\.gitkeep" | Out-Null
}
Write-Host "All directories created successfully."
