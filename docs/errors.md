# Errors

These are common errors that may occur when running this script.

## Script cancelled by user

This one ain't to hard to understand, right? You probably clicked cancel
somewhere...

## No documents open

This error occures because you tried to execute the script while no documents
are open. Just make sure to open a document and everything wwill be fine.

## Path to this file doesn't match the expected structure

This error probably occurs because you try to export a file which is not located
in a proper folder structure.

This script expects the InDesign-files to be placed folder adhearing to the
following folder structure:

* `/any/path/to/folder/2018/01/indesign-file.indd`
* `/any/path/to/folder/2018/02/indesign-file.indd`
* `/any/path/to/folder/2018/02 Special Edition/indesign-file.indd`
* `/any/path/to/folder/2018/03/indesign-file.indd`
* `/any/path/to/folder/2018/03 Any-oTher Nam3/indesign-file.indd`

As you can see the last two folders are the important ones. The first (in this
case `2018`) represent a year. This has to be four digits. This is probaly no
future-safe since this script needs to be updated ones we pass from year 9999
into year 10000. But I think we will do fine and might update this later on.

The second part is the name of the issue. The important part here is the two
digits in the beginning. They have to be there (e.g. 01, 02 and 11). But the can
also be followed by an additional name. This makes it possible to export special
issues tied to a main issue. The name can contain any charachter, digit, dash
(`-`), underscore (`_`) or whitespace.

As long as the InDesign-file (`.indd`) lies right inside that last folder the
export can take place. If not, the script will fail, and that probably why you
ended up here.

## From must be greater than or equal to to

This occures because you wrote a malformed range when trying to input page
range. Probably you wrote something like 10-1. But in this case 1 has to come
before 10.
