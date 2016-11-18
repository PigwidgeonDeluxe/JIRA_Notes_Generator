# JIRA_notes_generator
## Synopsis
This is a webapp that generates a table of issues/tasks from JIRA for quick meeting notes.

## Motivation
This webapp was created to fulfill the need of quickly creating meeting notes from JIRA and is intended to replace a Excel VBS solution.

## Prerequisites
#### This webapp requires:
- npm
- node.js
- jquery (included)

#### Node.js dependencies (included as zip folders):
- body-parser
- ejs
- express
- jquery.tabulator

## Installation
1. Download the webapp and install the prerequisites; extract the three folders named "jquery-ui", "node_modules", and "tabulator-master" to their respective names inside the webapp directory.
2. Run the webapp from a command prompt or terminal; open cmd/terminal, cd  to the webapp directory, and start the webapp using "node server.js" without quotes.
3. The webapp should start on localhost port 8081 (localhost:8081). A different address can be specified by editing server.js. The webapp is default tailored for a custom JIRA so custom fields may differ from other JIRAs.

## Built With
This webapp uses Tabulator for the table. Tabulator can be found here: http://olifolkerd.github.io/tabulator/ and currently is used with an MIT License. A copy of Tabulator is included in this Github.
