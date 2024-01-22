const fs = require('fs');
const readline = require('readline');

const newFilePath = './02-write-file/new-output.txt';
const fileStream = fs.createWriteStream(newFilePath, { flags: 'a' });

console.log('Welcome! Enter text (or type "exit" to end):');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  if (input.toLowerCase() === 'exit') {
    fileStream.end(() => {
      console.log('File stream closed.');
      console.log('Goodbye!');
      process.exit();
    });
  } else {
    fileStream.write(input + '\n');
    console.log('Enter more text:');
  }
});

process.on('SIGINT', () => {
  rl.close(); 
});

rl.on('close', () => {
  console.log('\nTerminating process. Goodbye!');
  fileStream.end(() => {
    console.log('File stream closed.');
    process.exit();
  });
});

fileStream.on('error', (err) => {
  console.error(`Error writing to file: ${err.message}`);
  process.exit(1);
});
