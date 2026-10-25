# Foamie Rescue

A free website where people give away old foam surfboards ("foamies") and other people adopt them. Like a pet rescue, but for boards.

**This runs only on your own computer.** It is not on the internet. Nothing gets deployed, and nothing runs on a timer.

The plans live in the [.plans](.plans) folder.

## Run it on your Mac

You only do steps 1 and 2 once.

### 1. Install Node.js (one time)

Node.js is the free program that runs the website.

1. Go to [nodejs.org](https://nodejs.org) and download the **LTS** version for Mac.
2. Open the file you downloaded and click through the installer.
3. To check it worked, open the **Terminal** app (press `Cmd + Space`, type "Terminal", press Enter) and type:

   ```
   node -v
   ```

   You should see a number like `v22.13.0` or higher.

### 2. Get the code (one time)

In Terminal, type these one line at a time and press Enter after each:

```
cd ~/Documents
git clone https://github.com/dutchdutchdutch/foamie-rescue.git
cd foamie-rescue
npm install
```

If your Mac asks to install "command line developer tools" when you type `git`, click **Install**, wait for it to finish, and type the `git clone` line again.

`npm install` downloads the building blocks the site needs. It takes a minute or two.

### 3. Start the website (every time)

In Terminal:

```
cd ~/Documents/foamie-rescue
npm run dev
```

Wait until you see `Ready`. Then open this link in your browser:

**http://localhost:3000**

"localhost" means "this computer". Only you can see it.

You may see a yellow-ish line in Terminal that says `ExperimentalWarning: SQLite`. That's harmless. It's the small database built into Node.js.

### 4. Stop the website

Click on the Terminal window and press `Ctrl + C`.

### Getting the newest version

After you merge a pull request on GitHub, get the changes like this:

```
cd ~/Documents/foamie-rescue
git pull
npm install
```

Then start it again with `npm run dev`.

## What you can try

- **Home** (http://localhost:3000): the newest boards.
- **Adopt** (http://localhost:3000/boards): all boards, with filters for "Ready to ride" and "Needs some love".
- **Give a board** (http://localhost:3000/give): list a board with a photo. You land on its profile page.

## Where your test boards are saved

Boards and photos you add are saved in the `data` folder inside the project. Only on your Mac, never uploaded.

To start fresh, stop the website, delete the `data` folder, and start it again. You'll get the three example boards back.

## Changing the name

The site's name and tagline are in [src/lib/site.ts](src/lib/site.ts). Change them there and they update everywhere.
