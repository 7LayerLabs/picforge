# PicForge - Setup on New Computer

Quick guide for setting up PicForge on a new computer.

## Setup Steps

### 1. Clone the Repository
```bash
git clone https://github.com/7LayerLabs/picforge.git
cd picforge
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Copy .env.local File
Copy the `.env.local` file from your main computer to this project folder.

**If you don't have it, create `.env.local` with:**
```env
GEMINI_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here
TOGETHER_API_KEY=your_key_here
```
(Contact Derek for actual API keys)

### 4. Run Development Server
```bash
npm run dev
```
Visit http://localhost:3000

## Daily Git Workflow

### Before Working
```bash
git pull  # Get latest changes
```

### After Working
```bash
git add .
git commit -m "Description of changes"
git push
```

## Quick Commands
```bash
npm run dev    # Start dev server
npm run build  # Build for production
git status     # See what changed
git pull       # Get updates
git push       # Send changes
```

## Important Notes
- `.env.local` is NOT in git - copy manually to each computer
- Changes auto-deploy to pic-forge.com when pushed
- Always `git pull` before starting work
