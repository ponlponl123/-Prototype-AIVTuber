//
// Artificial intelligence (AI) VTuber by DevPattarapong (ponlponl123) 
//
// # ⚠️ If ffmpeg doesn't work, try the path to ffmpeg.exe
//  like this: C:/code/AI_VTUBER/TTS/node_modules/ffmpeg-static/ffmpeg.exe
//
// This project is also compatible with NodeJS v16.17.1.
//
require('dotenv').config();
var twitch_username = 'TWITCH_USERNAME';
var twitch_token = 'TWITCH_TOKEN';
var twitch_channel = [ 'TWITCH_CHANNEL' ];
// FFMPEG
var ffmpeg_path = 'FFMPEG_PATH'; // like this: c:/ffmpeg/bin/ffmpeg.exe
// OPENAI
var openai_organization = 'ORGANIZATION';
var openai_apiKey = 'API_KEY';
// AWS
var aws_region = 'REGION';
var aws_accessKeyId = 'ACCESS_KEY_ID';
var aws_secretAccessKey = 'SECRET_ACCESS_KEY';

const host = 'localhost';
const port = 8000;
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
app.get('/TTS', (req, res) => {
    res.sendFile(__dirname + '/tts.html');
});
io.on('connection', (socket) => {
  console.log('a user connected');
});
server.listen(port, () => {
  console.log(`listening on ${host}:${port}`);
});
const AWS = require('aws-sdk');
const fs = require('fs');
const readline = require('readline');
const tmi = require('tmi.js');
const Speaker = require('speaker');
const wav = require('wav');
const { exec } = require('child_process');
const { Configuration, OpenAIApi } = require('openai');
const configuration = new Configuration({
    organization: openai_organization,
    apiKey: openai_apiKey,
});
const openai = new OpenAIApi(configuration);
const Polly = new AWS.Polly({
    region: aws_region,
    accessKeyId: aws_accessKeyId,
    secretAccessKey: aws_secretAccessKey
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
async function convertMp3ToWav(audioStream) {
    try {
      await fs.writeFile('path/to/output.mp3', audioStream, (err) => {
        if (err) throw err;
      });
      await fs.unlink('path/to/output.wav', (err) => {
        if (err) console.log('No previous file to delete');
      });
      await new Promise((resolve, reject) => {
        exec(`"${ffmpeg_path}" -i "path/to/output.mp3" -acodec pcm_s16le -ac 1 -ar 16000 "path/to/output.wav"`, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    } catch (err) {
      console.error(err);
    }
  }
  

const client = new tmi.Client({
    options: { debug: true },
    connection: { reconnect: true },
    identity: {
        username: twitch_username,
        password: twitch_token
    },
    channels: twitch_channel
});
client.connect().catch((error) => {
    console.error(error);
});
var ready = true;
async function getGptResponse(VARmessage) {
    try {
      const gptSend = await openai.createCompletion({
        model: 'text-curie-001',
        prompt: `${VARmessage}`,
        temperature: 0.9,
        max_tokens: 100,
        stop: ["ChatGPT:", "Adrian Twarog:"],
      });
      return gptSend;
    } catch (err) {
      console.error(err);
    }
  }
  
client.on('message', async (channel, tags, message, self) => {
    if(self) return;
    if(message){
        if(ready == true){
            ready = false;
            const gptResponse = await getGptResponse(message);            
            const params = {
                OutputFormat: 'mp3',
                Text: '<speak><prosody pitch="high">'+message+".................... "+gptResponse.data.choices[0].text+'</prosody></speak>',
                TextType: 'ssml',
                VoiceId: 'Ivy' // Japanese voice
            };
            console.log(`${message}`);
            console.log(`${gptResponse.data.choices[0].text}`);
            Polly.synthesizeSpeech(params, async (err, data) => {
                if (err) {
                    console.log(err.code)
                } else if (data) {
                    if (data.AudioStream instanceof Buffer) {
                        await convertMp3ToWav(data.AudioStream)
                        console.log(`File saved.`);
                        import('music-metadata').then( mm => {
                            mm.parseFile('path/to/output.mp3', {native: true})
                            .then(metadata => console.log(metadata.format.duration))
                            .catch(err => console.error(err.message));
                        });
                        try{
                            const reader = new wav.Reader();
                            const speaker = new Speaker();
                            reader.pipe(speaker);
                            fs.createReadStream('path/to/output.wav').pipe(reader)
                            io.emit('TTS', { subtitle: `${message}\n${gptResponse.data.choices[0].text}` });
                            console.log('text !== "exit" : Method')
                            if (ready == false) {
                                import('music-metadata').then( mm => {
                                    mm.parseFile('path/to/output.wav', {native: true})
                                    .then(metadata => {
                                        console.log(metadata.format.duration * 1000);
                                        setTimeout(() => {
                                            //mic.stopRecording();
                                            setTimeout(() => {ready = true;io.emit('TTS', { subtitle: "" });}, 2500);
                                        }, metadata.format.duration * 1000);
                                    })
                                    .catch(err => console.error(err.message));
                                });
                            }
                        } catch (err){
                            console.log(err)
                            process.exit()
                        }
                        
                    }
                }
            });
        }
    }
})
function promptUser() {
    rl.question('Pronounce by yourself: ', async (text) => {
        if(ready == true){
            ready = false;
            const params = {
                OutputFormat: 'mp3',
                Text: '<speak><prosody pitch="high">'+text+'</prosody></speak>',
                TextType: 'ssml',
                VoiceId: 'Ivy' // Japanese voice
            };
            console.log(`${text}`);

            Polly.synthesizeSpeech(params, async (err, data) => {
                if (err) {
                    console.log(err.code)
                } else if (data) {
                    if (data.AudioStream instanceof Buffer) {
                        // Save the audio stream to a file
                        await convertMp3ToWav(data.AudioStream)
                        console.log(`File saved.`);
                        import('music-metadata').then( mm => {
                            mm.parseFile('path/to/output.mp3', {native: true})
                            .then(metadata => console.log(metadata.format.duration))
                            .catch(err => console.error(err.message));
                        });
                        // Play the audio
                        try{
                            const reader = new wav.Reader();
                            const speaker = new Speaker();
                            reader.pipe(speaker);
                            fs.createReadStream('path/to/output.wav').pipe(reader)
                            io.emit('TTS', { subtitle: `${text}` });
                            console.log('text !== "exit" : Method')
                            if (text !== 'exit') {
                                import('music-metadata').then( mm => {
                                    mm.parseFile('path/to/output.wav', {native: true})
                                    .then(metadata => {
                                        console.log(metadata.format.duration * 1000);
                                        setTimeout(() => {
                                            //mic.stopRecording();
                                            setTimeout(() => {promptUser();ready = true;io.emit('TTS', { subtitle: "" });}, 2500);
                                        }, metadata.format.duration * 1000);
                                    })
                                    .catch(err => console.error(err.message));
                                });
                            }
                        } catch (err){
                            console.log(err)
                            process.exit()
                        }
                        
                    }
                }
            });
            if (text !== 'exit') {
                //console.log('cannot get duration from output file');
                // setTimeout(() => {
                //     promptUser();
                // }, 5000);
            } else {
                rl.close();
            }
        }
    });
}
setTimeout(() => { promptUser(); },2500);
