![Pattarapong.Dev](https://github.com/ponlponl123/AIVTuber/blob/main/img/PattarapongDev.png)

*Translation Engine: [Google Translate](https://translate.google.com/)*

**Project Check List**
- [x]  This project is also compatible with NodeJS v16.17.1.
- [ ]  This project is outdated.

# [WIP] AI VTuber by DevPattarapong
this project is in development...

* **Character Model by Live2D**
[Live2D Free Material License](https://www.live2d.jp/en/terms/live2d-free-material-license-agreement/)
* **AI Language Model by OpenAI**
[OpenAI Node License](https://github.com/openai/openai-node/blob/master/LICENSE)
![AI VTuber by DevPattarapong](https://github.com/ponlponl123/AIVTuber/blob/main/img/Screenshot.png)

# Installation
## TTS (Text-to-Speech) & OpenAI
- First, you need to install all package by running the following command: `npm install dotenv`
- Later you need to enter all the keys.
    ![Setup Keys](https://github.com/ponlponl123/AIVTuber/blob/main/img/Screenshot%202023-01-23%20203518.png)
    ### Twitch
    - At the variable `twitch_username` put your username as well as the variable `twitch_username`. `twitch_channel` too.
    - As for `twitch_token`, here are the [Docs](https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/#authorization-code-grant-flow) for this.
    ### FFMPEG
    - The `ffmpeg_path` variable is required to use ffmpeg.exe from https://ffmpeg.org/download.html.
    - example for this `c:/ffmpeg/bin/ffmpeg.exe`
    ### OpenAI
    - [This is the source for the variables. `openai_organization`](https://beta.openai.com/account/org-settings)
    - [This is the source for the variables. `openai_apiKey`](https://beta.openai.com/account/api-keys)
    ### AWS
    - Go to the AWS Console at https://console.aws.amazon.com/ and get **Access keys** from Security credentials
    ![AWS Access keys](https://github.com/ponlponl123/AIVTuber/blob/main/img/Screenshot%202023-01-23%20203227.png)

## VTube Studio API
I'm using the [VTS Desktop Audio Plugin by Lua Lucky](https://lualucky.itch.io/vts-desktop-audio-plugin) to capture the sound and send it as Parameters so that the sides of the character can move.

[Plugins list](https://github.com/DenchiSoft/VTubeStudio)

https://lualucky.itch.io/vts-desktop-audio-plugin
![](https://github.com/ponlponl123/AIVTuber/blob/main/img/Screenshot%202023-01-23%20165939.png)

## node main.js
Finally, if everything goes as expected. You will now be able to run `node main.js` successfully. 
