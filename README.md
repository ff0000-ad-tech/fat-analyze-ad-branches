# Ad Branch Analyzer

## Usage

```
analyze-ad-branches <fatAdPath> [-b | --branches] <space-delimited list of branches>

# Example:
analyze-ad-branches ./cool-ad -b master feature/experimental
```

## Todo
- [ ] Determine application input (json vs. cli args)
  - [ ] Ad Path
  - [ ] List of branches
- [ ] Get list of branches
- [ ] For each branch:
  - [ ] switch branch if needed
  - [ ] if switched branches, reinstall
  - [ ] run Creative Server
  - [ ] run 2-debug and 3-traffic processes
  - [ ] Get build.bundle size for debug and traffic builds
  - [ ] Preview w/ Puppeteer to get HAR
  - [ ] Analyze HAR and ad runtime for:
    - [ ] Total size of requests
    - [ ] Time to ad completion
  - [ ] Output JSON with branch data to ad folder
  - [ ] kill Creative Server and debug process

## Notes
- Uses Puppeteer for headless browser automation
- Uses Yargs for CLI arg parsing

