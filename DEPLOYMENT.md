# Deployment Instructions for riptonic.com/tennis

Your USTA Tennis Schedule Importer is now configured to run at `riptonic.com/tennis` without affecting your existing site.

## Quick Deployment Steps

### 1. Upload Files to Your Server

Upload the contents of the `dist/` folder to your server at the `/tennis/` directory:

```
riptonic.com/
├── (your existing site files)
└── tennis/
    ├── index.html
    ├── vite.svg
    ├── match_calendar.png
    └── assets/
        ├── index-D5HKapkE.css
        └── index-aadmADPC.js
```

### 2. File Upload Methods

**Option A: FTP/SFTP**
- Connect to your server via FTP/SFTP
- Navigate to your website root directory
- Create a `tennis` folder
- Upload all contents from `dist/` to the `tennis/` folder

**Option B: cPanel File Manager**
- Login to cPanel
- Open File Manager
- Navigate to `public_html` (or your domain's folder)
- Create a new folder named `tennis`
- Upload all files from `dist/` to the `tennis/` folder

**Option C: Command Line (if you have SSH access)**
```bash
# On your server
mkdir /path/to/your/website/tennis
# Then upload the dist files to this directory
```

### 3. Server Configuration (Optional)

If you want clean URLs or need specific server configurations, add this to your `.htaccess` file in the `/tennis/` directory:

```apache
# .htaccess for /tennis/ directory
RewriteEngine On
RewriteBase /tennis/

# Handle React Router (if needed in future)
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /tennis/index.html [L]

# Security headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
```

### 4. Test Your Deployment

1. Visit `riptonic.com/tennis` in your browser
2. Verify the app loads correctly
3. Test pasting USTA schedule data
4. Test downloading the .ics file
5. Test importing the file into Google Calendar

## File Structure Explanation

- `index.html` - Main app page
- `assets/index-*.js` - React app JavaScript bundle
- `assets/index-*.css` - App styles (TailwindCSS)
- `vite.svg` - Default favicon
- `match_calendar.png` - Reference image you uploaded

## Domain Configuration

The app is pre-configured to work at `/tennis/` path. All asset links are relative to this path, so:
- ✅ `riptonic.com/tennis` will work correctly
- ✅ Your existing `riptonic.com` site remains unchanged
- ✅ All CSS and JavaScript files load properly

## Troubleshooting

**If the page shows blank or errors:**
1. Check browser console (F12) for errors
2. Verify all files uploaded correctly
3. Check file permissions (644 for files, 755 for directories)
4. Ensure `/tennis/` directory is publicly accessible

**If assets don't load:**
1. Verify the `assets/` folder uploaded correctly
2. Check that file names match exactly (case-sensitive)
3. Confirm server allows `.js` and `.css` files

## Future Updates

To update the app:
1. Run `npm run build` in the project directory
2. Upload the new `dist/` contents to your `/tennis/` folder
3. Clear browser cache if needed

The app is fully self-contained and doesn't require a database or server-side processing.