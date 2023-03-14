![Pattarapong.Dev](https://github.com/ponlponl123/AIVTuber/blob/main/img/PattarapongDev.png)
![InsanityLabs](https://github.com/InsanityLabs/AIVTuber/blob/main/img/Insanity%20Labs.png)
*Translation Engine: [Google Translate](https://translate.google.com/)*

**Project Check List**
- [x]  This project is also compatible with NodeJS v16.17.1.
- [x]  Better TTS.
- [x]  OpenAI ChatGPT.
- [ ]  This project is outdated.

# AI VTuber by DevPattarapong & InsanityLabs 
this project is in development...

* **Character Model by Live2D**
[Live2D Free Material License](https://www.live2d.jp/en/terms/live2d-free-material-license-agreement/)
* **AI Language Model by OpenAI**
[OpenAI Node License](https://github.com/openai/openai-node/blob/master/LICENSE)
![AI VTuber by DevPattarapong](https://github.com/ponlponl123/AIVTuber/blob/main/img/Screenshot.png)

# Installation
## TTS (Text-to-Speech) & OpenAI
- First, you need to install all package by running the following command: `npm install dotenv`
    ### Twitch
    - At the variable `twitch_username` put your username as well as the variable `twitch_username`. `twitch_channel` too.
    - As for `twitch_token`, here are the [Docs](https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/#authorization-code-grant-flow) for this.
    ### FFMPEG
    - The `ffmpeg_path` variable is required to use ffmpeg.exe from https://ffmpeg.org/download.html.
    - example for this `c:/ffmpeg/bin/ffmpeg.exe`
    ### OpenAI
    - [This is the source for the variables. `openai_apiKey`](https://beta.openai.com/account/api-keys)
    - put the api key in the .env file
    ### ElevenLabs
    - Go to ElevenLabs at https://elevenlabs.io and get **API key** from Your Profile
    

## VTube Studio API
I'm using the [VTS Desktop Audio Plugin by Lua Lucky](https://lualucky.itch.io/vts-desktop-audio-plugin) to capture the sound and send it as Parameters so that the sides of the character can move.

[Plugins list](https://github.com/DenchiSoft/VTubeStudio)

https://lualucky.itch.io/vts-desktop-audio-plugin
![](https://github.com/ponlponl123/AIVTuber/blob/main/img/Screenshot%202023-01-23%20165939.png)

## node main.js
Finally, if everything goes as expected. You will now be able to run `node main.js` successfully. 
