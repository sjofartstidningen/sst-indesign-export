# Indesign Export

> Export all pages inside an InDesign document as separate pdf's

[![GitHub release][releases-badge]][releases-link]
[![Build Status][build-badge]][build-link]
[![All Contributors][contributors-badge]](#contributors)
[![MIT License][license-badge]][license]

`sst-indesign-export` will take the location of your files and export every page
in the document, separately, to a specified location.

## The problem

This script was developed to streamline the workflow for us at
[Sjöfartstidningen](https://www.sjofartstidningen.se), a small shipping magazine
in Sweden. We produce a monthly magazine and every issue needs to be exported
into one pdf per page before we send it to the printer.

So we needed a simple way to export every page, and also to a specific
destination (in our case a folder on Dropbox).

We have also tried the
[PageExporter](https://indesignsecrets.com/page-exporter-utility-peu-5-script-updated-for-cs3.php)
utility, but it's a bit too advanced. And also, the codebase is pretty old and
we wanted a more modern workflow (no real critique, just that our developers are
more customed to the workflow of 2018's web development).

## The solution

The solution is `sst-indesign-export`. It's a pretty simple script, actually. It
will ask you for a range of pages to export (or `All pages`). Then it will ask
you for a pdf-preset to use. And lastly it will export each of these pages
separately into a destination that you define the first time you run the script.

For a more detailed description, see [Usage](#usage) below.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->

<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

* [Requirements](#requirements)
* [Installation](#installation)
* [First time usage](#first-time-usage)
* [Regular usage](#regular-usage)
* [Reset settings](#reset-settings)
* [Issues](#issues)
* [Example](#example)
* [Contributors](#contributors)
* [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Requirements

* InDesign (tested on v13, CC 2018)
* macOS (not tested on Windows)

## Installation

Every new version of this script is published as a release here on GitHub. You
find the latest release
[here](https://github.com/sjofartstidningen/sst-indesign-export/releases).

1. Download the file named `sst-indesign-export-X.X.X.jsx` (X.X.X is the version
   number).
2. Put the file in your InDesign scripts folder (You find it if you open the
   "Scripts"-panel in InDesign (Alt+Cmd+F11 on Mac) and right click on the
   "User"-folder and choose "Show in Finder")
3. Run the script by double-clicking on it inside the "Scripts"-panel

## First time usage

This script doesn't need much to be able to run smoothly. But it needs you to
follow one rule: **You have to keep a certain folder structure.** The folder
structure is used to determine how to name and where to put your newly exported
pages.

The structure that is needed is the following:

```
/path/to/any/folder/2018/01/file.indd
 ^1                 ^2   ^3 ^4
```

1. `root`: The root of the folder structure can be anything. It can be on a
   server or on your local machine, it doesn't matter
2. `year`: Your magazine needs to be sorted by year, and the year needs to be in
   four digits
3. `issue`: This is the name of your issues, they need to be numbered and begin
   with two digits. But it can also be followed by an optional name (e.g.
   `01 Special Edition`)
4. `file`: What you call the file isn't important, as long as it lives right
   inside a `year/issue/`-folder

The `year`- and `issue`-parts of your folder structure will be used when the
pages are being exported.

The first time you run the script you will be prompted to select a "root"-folder
where all your exports will be placed. The pages will end up in subfolders
inside this root folder.

```
Original file:
/path/to/project/2018/01/magazine.indd

Will produce:
/path/to/root/2018/01/2018-01-001.pdf
/path/to/root/2018/01/2018-01-002.pdf
/path/to/root/2018/01/2018-01-003.pdf
/path/to/root/2018/01/2018-01-004.pdf
/path/to/root/2018/01/2018-01-005.pdf
...
```

You get the picture, right? This root folder will only be asked for once.

## Regular usage

After the initial "setup" the script will only ask you two questions:

1. Page range, a range of pages to export (e.g. `All pages`, `1,2-3,5,4`)
2. PDF preset

The pdf-preset settings will be stored and the next time you use the script it
will be used as default. This is the case every time you pick a new preset.

## Reset settings

Two things are stored by this script: export root folder and pdf-preset. The pdf
preset can always be updated. But if you need to change the export root folder
you have to act a bit differently.

The config file is stored inside a hidden `.config`-folder in you home directory
(`~`), and called `sst-indesign-export@vX.X.X.json`.

To reset the settings you simply need to delete this file. To do this there are
two ways (prefer the first one if you don't know the command line in Terminal):

1. Access the hidden folder by opening Finder and pressing `Cmd+Shift+.` on your
   keyboard. The hidden folders will then be visible. Go into the folder and
   delete the settings file (there might be multiple of them if you updated the
   script).
2. Run the following command inside the Terminal-app:
   `rm ~/.config/sst-indesign-export*.json`. This will delete every config file
   created by the script.

## Issues

If an error occures while running the script you might be able to click a
`View help`-button. This button will take you to
[docs/errors.md](https://github.com/sjofartstidningen/sst-indesign-export/blob/master/docs/errors.md).
Hopefully you will find a solution there. Otherwise, reach out to us via the
[issues-page][issues].

## Example

I want to describe how we at Sjöfartstidningen use this script, then you might
be able to determine if the use-case is applicable to you situation.

We produce a magazine which comes out with eleven issues per year. And we keep
all our InDesign files on Dropbox, mirrored to our computers.

They are stored in a root folder on Dropbox and sorted first by year, then by
issue (`Dropbox/Magazine/2018/01/files.indd`).

There are to reasons for us to export each page into individual pdf's.

First because the printer asks for it. That way the can replace individual pages
if we come up with corrections.

Secondly because we use the [Dropbox API](https://www.dropbox.com/developers) to
extract previews from these pdf's and display them in a browser based tool. This
tool makes it possible for us to get an overview of whats going on and also do
some proof-reading.

Therefore we want to export all our pages into another folder on our Dropbox
server (`Dropbox/Exports/2018/01/2018-01-001.pdf`).

That's how we use this script. Reach out to us, via [issues][issues], if you
have any questions or if you think the script can be adapted to other use-cases
as well.

## Contributors

Thanks goes to these people ([emoji key][emojis]):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->

<!-- prettier-ignore -->
| [<img src="https://avatars1.githubusercontent.com/u/13746650?v=4" width="100px;"/><br /><sub><b>Adam Bergman</b></sub>](http://fransvilhelm.com)<br />[💻](https://github.com/adambrgmn/frans-scripts/commits?author=adambrgmn "Code") [📖](https://github.com/adambrgmn/frans-scripts/commits?author=adambrgmn "Documentation") [💡](#example-adambrgmn "Examples") [🤔](#ideas-adambrgmn "Ideas, Planning, & Feedback") [⚠️](https://github.com/adambrgmn/frans-scripts/commits?author=adambrgmn "Tests") |
| :---: |

<!-- ALL-CONTRIBUTORS-LIST:END -->

Reach out to us if you want to contribute to this script.

This project follows the [all-contributors][all-contributors] specification.
Contributions of any kind welcome!

## License

MIT

[releases-badge]: https://img.shields.io/github/release/sjofartstidningen/sst-indesign-export.svg
[releases-link]: https://github.com/sjofartstidningen/sst-indesign-export/releases
[build-badge]: https://travis-ci.org/sjofartstidningen/sst-indesign-export.svg?branch=master
[build-link]: https://travis-ci.org/sjofartstidningen/sst-indesign-export
[license-badge]: https://img.shields.io/npm/l/kcd-scripts.svg
[license]: https://github.com/sjofartstidningen/sst-indesign-export/blob/master/LICENSE
[issues]: https://github.com/sjofartstidningen/sst-indesign-export/issues
[emojis]: https://github.com/kentcdodds/all-contributors#emoji-key
[all-contributors]: https://github.com/kentcdodds/all-contributors
[contributors-badge]: https://img.shields.io/badge/all_contributors-1-orange.svg
