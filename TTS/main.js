
require('dotenv').config();
const voice = require('elevenlabs-node');
const express = require('express');
const http = require('http');
const fs = require('fs');
const readline = require('readline');
const tmi = require('tmi.js');
const Speaker = require('speaker');
const wav = require('wav');

var ffmpeg_path = 'path'; // like this: c:/ffmpeg/bin/ffmpeg.exe
var openai_apiKey = process.env.OPENAI_API_KEY;
const elapiKey = 'API_KEY'; // Your API key from Elevenlabs
const voiceID = '21m00Tcm4TlvDq8ikWAM'; // The ID of the voice you want to get
const fileName = 'path/to/output.mp3'; // The name of your audio file
var stability = 1.00 // do not mess with these values they are set to give human like speech
var similarityBoost = 0.70
const host = 'localhost';
const port = 8000;
const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
app.get('', (req, res) => {
    res.sendFile(__dirname + '/tts.html');
});

//this console log has been disabled as it caused issues with the text box in console. 
// io.on('connection', (socket) => {
//   console.log('a user connected');
// });
server.listen(port, () => {
  console.log(`listening on ${host}:${port}`);
});

const { Writable } = require('stream');
const { exec } = require('child_process');
const { Configuration, OpenAIApi } = require('openai');
const configuration = new Configuration({
    apiKey: openai_apiKey,
});

const openai = new OpenAIApi(configuration);


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


//this is to get voice IDs
// const voiceResponse = voice.getVoice(elapiKey, voiceID).then(res => {
// 	console.log(res);
// });

async function convertMp3ToWav() {
	try {
		// Read the audio stream from file
		const audioStream = fs.readFileSync('path/to/output.mp3');
		// Delete any previous output file
		await fs.promises.unlink('path/to/output.wav').catch(() => {});
		// Convert the MP3 file to WAV
		await new Promise((resolve, reject) => {
			exec(`"${ffmpeg_path}" -i "path/to/output.mp3" -acodec pcm_s16le -ac 1 -ar 16000 "path/to/output.wav"`, (err) => {
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			});
		});
		console.log(`File saved.`);
	} catch (err) {
		console.error(err);
	}
}
// put your twitch infomation here
const client = new tmi.Client({
    options: { debug: true },
    connection: { reconnect: true },
    identity: {
        username: 'bot_name',
        password: 'bot_token'
    },
    channels: [ 'channel_name' ]
});
client.connect().catch((error) => {
    console.error(error);
});
var ready = true;
async function getGptResponse(VARmessage) {
    try {
      const gptSend = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
            {role: "system", content: "system message basicly a description of the robot"},
            {role: "user", content: `${VARmessage}`}
        ],
      });
      return gptSend;
    } catch (err) {
      console.error(err);
    }
  }
  
  client.on('message', async (channel, tags, message, self) => {
	if (self) return;
	if (message) {
		if (ready == true) {
			ready = false;
			const gptResponse = await getGptResponse(message);
			console.log(`${message}`);
			console.log(`${gptResponse.data.choices[0].message.content}`);
			const text = gptResponse.data.choices[0].message.content;
			voice.textToSpeechStream(elapiKey, voiceID, text, stability, similarityBoost).then(async res => {
				// console.log('res:', res);
				res.pipe(fs.createWriteStream(fileName));
				res.on('error', err => {
					console.error(err);
				});
				res.on('end', async () => {
					// Save the audio stream to a file
					await convertMp3ToWav();
					console.log(`File saved.`);
					import ('music-metadata').then(mm => {
						mm.parseFile('path/to/output.mp3', {
							native: true
						}).then(metadata => console.log(metadata.format.duration))
					});
					// Play the audio
					try {
						const reader = new wav.Reader();
						const speaker = new Speaker();
						reader.pipe(speaker);
						fs.createReadStream('path/to/output.wav').pipe(reader)
						io.emit('TTS', {
							subtitle: `${message}\n${gptResponse.data.choices[0].message.content}`
						});
						console.log('text !== "exit" : Method')
						if (text !== 'exit') {
							import ('music-metadata').then(mm => {
								mm.parseFile('path/to/output.wav', {
									native: true
								}).then(metadata => {
									console.log(metadata.format.duration * 1000);
									setTimeout(() => {
										//mic.stopRecording();
										setTimeout(() => {
											promptUser();
											ready = true;
											io.emit('TTS', {
												subtitle: ""
											});
										}, 2500);
									}, metadata.format.duration * 1000);
								})
								//.catch(err => console.error(err.message));
							});
						}
					} catch (err) {
						console.log(err)
						process.exit()
					}
				});
			}).catch(err => {
				console.error(err);
			});
		}
	}
});



function promptUser() {
	rl.question('Pronounce by yourself: ', async (text) => {
		if (ready == true) {
			ready = false;
			console.log(`${text}`);
			voice.textToSpeechStream(elapiKey, voiceID, text, stability, similarityBoost).then(async res => {
				// console.log('res:', res);
				res.pipe(fs.createWriteStream(fileName));
				res.on('error', err => {
					console.error(err);
				});
				res.on('end', async () => {
					// Save the audio stream to a file
					await convertMp3ToWav();
					console.log(`File saved.`);
					import ('music-metadata').then(mm => {
						mm.parseFile('path/to/output.mp3', {
							native: true
						}).then(metadata => console.log(metadata.format.duration))
					});
					// Play the audio
					try {
						const reader = new wav.Reader();
						const speaker = new Speaker();
						reader.pipe(speaker);
						fs.createReadStream('path/to/output.wav').pipe(reader)
						io.emit('TTS', {
							subtitle: `${text}`
						});
						console.log('text !== "exit" : Method')
						if (text !== 'exit') {
							import ('music-metadata').then(mm => {
								mm.parseFile('path/to/output.wav', {
									native: true
								}).then(metadata => {
									console.log(metadata.format.duration * 1000);
									setTimeout(() => {
										setTimeout(() => {
											promptUser();
											ready = true;
											io.emit('TTS', {
												subtitle: ""
											});
										}, 2500);
									}, metadata.format.duration * 1000);
								})
							});
						}
					} catch (err) {
						console.log(err)
						process.exit()
					}
				});
			}).catch(err => {
				console.error(err);
			});
			if (text !== 'exit') {
				console.log('cannot get duration from output file');
				setTimeout(() => {
					promptUser();
				}, 5000);
			} else {
				rl.close();
			}
		}
	});
}
setTimeout(() => {
	promptUser();
}, 2500);
console.log("current version: 0.27_insanitylabs");
