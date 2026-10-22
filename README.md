# RJ & Kate Wedding Website

Open `index.html` in a browser. Search `index.html` for `[EDIT:` to find the text you still need to fill in.

## Connecting the RSVP to Google Forms

1. Create a Google Form with these 4 questions, using **exactly** these answer types:
   - **Full name**: Short answer (required)
   - **Will you attend?**: Multiple choice with two options, spelled exactly `Joyfully accepts` and `Regretfully declines`
   - **Number of guests**: Dropdown with options `1`, `2`, `3`, `4`
   - **Message**: Paragraph
2. In Settings → Responses, turn **off** "Collect email addresses" and "Limit to 1 response". Otherwise guests have to sign in to Google and RSVPs from the website won't go through.
3. Click the **⋮** menu → **Get pre-filled link**. Type any answer in each field (for example `test`) and click **Get link** → **Copy link**.
4. The copied link looks like:
   `https://docs.google.com/forms/d/e/1FAIpQL.../viewform?usp=pp_url&entry.123456=test&entry.789012=Joyfully+accepts...`
   - The `1FAIpQL...` part is your **form ID**.
   - Each `entry.NUMBERS` is a **field ID**, in the same order as your questions.
5. In `js/main.js`, fill in `GOOGLE_FORM`:
   ```js
   action: 'https://docs.google.com/forms/d/e/1FAIpQL.../formResponse',
   fields: {
     name: 'entry.123456',
     attending: 'entry.789012',
     guests: 'entry....',
     message: 'entry....'
   }
   ```
6. Send a test RSVP from the website and check the **Responses** tab of your form. Click the green Sheets icon there to see every RSVP in a spreadsheet.
