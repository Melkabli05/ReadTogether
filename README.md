

## Project Structure

The following structure illustrates the recommended organization for this Angular application, following best practices for modularity, maintainability, and scalability:

```
src
└── app
    ├── app.ts                      // Main standalone component
    ├── app.config.ts
    ├── app.routes.ts
    ├── app.html
    ├── app.css
    ├── app.spec.ts
    │
    ├── core                        // Non-business specific, app-wide features
    │   ├── auth                    // Authentication (login, register, user session)
    │   │   ├── models
    │   │   │   └── user.model.ts
    │   │   ├── guards
    │   │   │   └── auth-guard.ts
    │   │   ├── services
    │   │   │   └── auth.ts         // (formerly auth.service.ts)
    │   │   ├── pages
    │   │   │   ├── login
    │   │   │   └── register
    │   │   └── auth.routes.ts
    │   ├── layout                  // Main app shell, navbars, footers
    │   │   └── components
    │   │       ├── navbar
    │   │       └── footer
    │   ├── services                // Isolated core services
    │   │   └── notification.ts     // For global notifications
    │   │   └── theme.ts            // For theme management (dark/light mode)
    │   └── interceptors
    │       └── api-interceptor.ts  // For HTTP request manipulation
    │
    ├── modules                     // Business domain features
    │   ├── user-profile
    │   │   ├── pages
    │   │   │   └── view-profile
    │   │   │   └── edit-profile
    │   │   ├── components
    │   │   │   └── profile-card    // Could be a 'smart' shared component if only used within this domain
    │   │   ├── services
    │   │   │   └── user-profile.ts
    │   │   └── user-profile.routes.ts
    │   │
    │   ├── reading-exchange        // Core domain for finding partners and texts
    │   │   ├── pages
    │   │   │   └── find-partner
    │   │   │   └── browse-texts
    │   │   ├── components
    │   │   │   └── partner-filter
    │   │   │   └── text-preview-card
    │   │   ├── services
    │   │   │   └── partner-matching.ts
    │   │   │   └── text-discovery.ts
    │   │   └── reading-exchange.routes.ts
    │   │
    │   ├── reading-session         // The interactive reading experience
    │   │   ├── components
    │   │   │   ├── text-viewer     // Displays the text, handles highlighting
    │   │   │   ├── chat-panel      // Integrated text/voice chat
    │   │   │   └── correction-tool // UI for suggesting/accepting corrections
    │   │   ├── services
    │   │   │   └── real-time-sync.ts // Handles WebSocket communication
    │   │   │   └── reading-tool.ts   // Business logic for text interaction
    │   │   ├── models
    │   │   │   └── session.model.ts
    │   │   │   └── annotation.model.ts
    │   │   └── reading-session.routes.ts // e.g., /session/:sessionId
    │   │
    │   ├── content-management      // For users to upload and manage their texts
    │   │   ├── pages
    │   │   │   └── my-texts
    │   │   │   └── upload-text
    │   │   ├── services
    │   │   │   └── file-upload.ts
    │   │   │   └── library.ts
    │   │   ├── components
    │   │   │   └── file-uploader-ui
    │   │   └── content-management.routes.ts
    │   │
    │   └── community               // Optional: for "Reading Moments" or forums
    │       ├── pages
    │       │   └── feed
    │       │   └── post-detail
    │       ├── components
    │       │   └── moment-card
    │       │   └── comment-thread
    │       └── community.routes.ts
    │
    └── shared                      // Dumb, reusable UI components, pipes, utils
        ├── components
        │   ├── button              // Reusable custom button
        │   ├── modal
        │   └── loading-spinner
        ├── pipes
        │   └── truncate-text-pipe.ts
        │   └── relative-time-pipe.ts
        ├── directives
        │   └── highlight-on-hover.ts
        └── utils
            ├── validation.utils.ts
            └── formatting.utils.ts
```
