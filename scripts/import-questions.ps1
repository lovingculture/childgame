param([string]$CsvPath = (Join-Path $PSScriptRoot '..\data\basic-questions-266.csv'))
$ErrorActionPreference = 'Stop'
$rows = @(Import-Csv -LiteralPath $CsvPath -Encoding utf8)
if ($rows.Count -ne 266) { throw "266문항이 필요합니다. 현재: $($rows.Count)" }
if (@($rows.id | Select-Object -Unique).Count -ne 266) { throw '문제 ID가 중복되었습니다.' }
$types = @('batchim', 'word-choice', 'sentence', 'fix-spelling', 'image', 'audio')
foreach ($row in $rows) {
    $choices = @($row.choices.Split('|') | ForEach-Object { $_.Trim() })
    if ($row.type -notin $types) { throw "알 수 없는 유형: $($row.id)" }
    if (@($choices | Select-Object -Unique).Count -ne $choices.Count) { throw "보기 중복: $($row.id)" }
    if (@($choices | Where-Object { $_ -ceq $row.answer }).Count -ne 1) { throw "정답 누락 또는 중복: $($row.id)" }
    if ($row.type -eq 'audio' -and (!$row.audioSrc -or !$row.audioText)) { throw "음성 경로/대본 누락: $($row.id)" }
}
foreach ($group in ($rows | Group-Object world,stage)) {
    $world = [int]$group.Group[0].world
    $stage = [int]$group.Group[0].stage
    $expected = if ($stage -ne 5) { 10 } elseif ($world -le 3) { 12 } else { 15 }
    if ($world -lt 1 -or $world -gt 5 -or $stage -lt 1 -or $stage -gt 5 -or $group.Count -ne $expected) { throw "스테이지 구성 오류: $($group.Name)" }
}
$rows | ConvertTo-Json -Depth 3 | Set-Content -LiteralPath (Join-Path $PSScriptRoot '..\data\questions-source.json') -Encoding utf8NoBOM
$lines = @('# 음성 문제 녹음 대본', '', 'batchim_questions_266.csv의 음성 문항을 기준으로 생성했습니다.', '문장을 읽고 지정된 파일 이름으로 public/audio/에 저장하세요.', 'mp3, m4a, wav 형식을 지원합니다.', '')
foreach ($row in ($rows | Where-Object type -eq 'audio')) {
    $lines += @("## $($row.id).mp3", '', $row.audioText, '', "목표 단어: $($row.word)", '')
}
$lines | Set-Content -LiteralPath (Join-Path $PSScriptRoot '..\public\audio\녹음대본.md') -Encoding utf8NoBOM
Write-Output "CSV $($rows.Count)문항 반영 및 음성 대본 생성 완료."
