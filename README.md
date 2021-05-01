# ULA -- Universal Learning App

ULA is a template for an educational app (android/iOS/web).

You should:

- prepare text in markdwon, as simple as you write articles for blog
- put files into specific folders (e.g.`chapterId/subchapterId/images`)

And you get:

- interactive app, something between Duolingo and Coursera.

The template is [open sourced](https://github.com/aparus/ula) and has free license.

At the moment, we have four types of materials, combining that you can create a great learning process for the user.

| <center>[richText](#richText)</center>       | <center>[richMedia](#richMedia)</center>      |
| -------------------------------------------- | --------------------------------------------- |
| ![richText](https://i.imgur.com/TJYI1aQ.gif) | ![richMedia](https://i.imgur.com/RWNPnPJ.gif) |

| <center>[fileCard](#fileCard)</center>       | <center>[exercise](#exercise)</center>       |
| -------------------------------------------- | -------------------------------------------- |
| ![fileCard](https://i.imgur.com/gXFrs6C.gif) | ![exercise](https://i.imgur.com/KGCGILw.gif) |

## Material types

### richText

<div style='text-align:center;margin-bottom:20px'>
<img src="https://i.imgur.com/TJYI1aQ.gif" /> 
</div>

It is a screen with rich formatted blog like explanations.

You can use standard markdown: headers, bold, italic, blockquotes, images.

In addition to markdown you can add videos and audios from local files, network links and youtube.

You can add into text sounded words (they will play on click on them) and quizzes, with auto check user answer for correctness.

For more info: [Material type: richText](https://hackmd.io/KQM-meSAR3SL6O21Hm9fCQ#Example)

### richMedia

<div style='text-align:center;margin-bottom:20px'>
<img src="https://i.imgur.com/RWNPnPJ.gif" /> 
</div>

In richMedia you can join media file and subtitles into phrasal player with parallels texts: original and translation. It works for both: audio and video.

You can watch active phrase while playing, play particular phrases, change speed of playback etc.

Also you can organize your subtitles in a chat like manner, with avatars and speaker names.

In next versions we have planned: quizes with timestamp, that will appear on some point of playback and drill/dictation mode.

For more info: [Material type: richMedia](https://hackmd.io/o4HTHEKSTliryte3oxDQ-A#Example)

### fileCard

<div style='text-align:center;margin-bottom:20px'>
<img src="https://i.imgur.com/gXFrs6C.gif" /> 
</div>

With this kind of material you can organize multiple files (images+sounds) into flash cards or phrasebook.

Then you can use them in exercises.

For more info: [Material type: fileCard](https://hackmd.io/HHhHci-WRjSSixxvJp8mcg#Example)

### exercise

<div style='text-align:center;margin-bottom:20px'>
<img src="https://i.imgur.com/KGCGILw.gif" /> 
</div>

Exercises are build on top of `richMedia` and `fileCard` material types.

They provide user with activities, like:

- listen to the audio, and write what you have heard
- read the text and choose correct translation
- look at image and order words
- e.t.c. and all possible combinations of those kind of exercises.

After each exercise app gives to user feedback: was his answer right or wrong.

For more info: [Material type: exercise](https://hackmd.io/1REdGQInTNS5Nno00J-7Ug#Example)

## Conclusion

If you have content like

- texts
- translations
- images
- audios
- videos
- subtitles

and you want to organize them into interactive educational app, something between Duolingo and Coursera, without coding -- you should try ULA.

The app will be avaliable on:

- android
- iOS
- web (site, SPA, PWA)

## What's next?

Read about how [Navigation](/6GcL8iOeRI2XfytYxc-4IQ) works in ULA.
