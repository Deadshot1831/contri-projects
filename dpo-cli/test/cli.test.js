describe('CLI functionality', () => {
  it('should execute the help command', () => {
    // Mock the command line input for help
    const input = 'node dpo-cli bin/dpo_cli.js help';
    const output = executeCLI(input);
    expect(output).toContain('Usage:');
  });

  it('should execute the version command', () => {
    // Mock the command line input for version
    const input = 'node dpo-cli bin/dpo_cli.js version';
    const output = executeCLI(input);
    expect(output).toContain('dpo-cli version 0.2.0');
  });

  it('should handle invalid commands gracefully', () => {
    // Mock the command line input for an invalid command
    const input = 'node dpo-cli bin/dpo_cli.js invalidCommand';
    const output = executeCLI(input);
    expect(output).toContain('Error: Command not found');
  });
});