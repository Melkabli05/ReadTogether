

## Project Structure

```
src
└── app
    ├── app.config.ts
    ├── app.routes.ts
    ├── app.component.ts / .html / .css
    └── main.ts

    ├── core                                // Singleton services & system-level logic
    │   ├── auth
    │   │   ├── models
    │   │   │   └── user.model.ts
    │   │   ├── guards
    │   │   │   └── auth.guard.ts
    │   │   ├── services
    │   │   │   └── auth.service.ts
    │   │   ├── pages
    │   │   │   └── login/
    │   │   │   └── register/
    │   │   └── auth.routes.ts
    │   ├── interceptors
    │   │   └── auth.interceptor.ts
    │   │   └── error.interceptor.ts
    │   ├── layout
    │   │   └── shell/                    // AppShell w/ sidebar, header, footer
    │   │   └── sidebar/
    │   │   └── header/
    │   │   └── footer/
    │   └── theme/
    │       └── theme.service.ts
    │       └── dark-mode-toggle/

    ├── shared                              // Reusable UI & utils
    │   ├── components/
    │   │   ├── button/
    │   │   ├── modal/
    │   │   ├── avatar/
    │   │   ├── loading-spinner/
    │   ├── pipes/
    │   │   └── time-ago.pipe.ts
    │   │   └── truncate.pipe.ts
    │   ├── directives/
    │   │   └── auto-scroll.directive.ts
    │   └── utils/
    │       ├── date.utils.ts
    │       └── validation.utils.ts

    ├── features                             // Business domains
    │
    │   ├── user-profile
    │   │   ├── pages/
    │   │   │   └── view-profile/
    │   │   │   └── edit-profile/
    │   │   ├── components/
    │   │   │   └── profile-header/
    │   │   ├── services/
    │   │   │   └── user-profile.service.ts
    │   │   └── user-profile.routes.ts
    │
    │   ├── reading-room                    // Real-time reading experience
    │   │   ├── pages/
    │   │   │   └── room-stage/             // Reader + moderator view
    │   │   │   └── room-preview/           // Before joining
    │   │   ├── components/
    │   │   │   └── text-viewer/            // Highlights, turn indicator
    │   │   │   └── turn-tracker/           // Who reads now
    │   │   │   └── reactions-panel/
    │   │   │   └── chat-panel/
    │   │   │   └── correction-tools/
    │   │   ├── models/
    │   │   │   └── room.model.ts
    │   │   │   └── turn.model.ts
    │   │   ├── services/
    │   │   │   └── real-time.service.ts
    │   │   │   └── room.service.ts
    │   │   └── reading-room.routes.ts
    │
    │   ├── discovery                       // Find readers & texts
    │   │   ├── pages/
    │   │   │   └── find-partner/
    │   │   │   └── browse-texts/
    │   │   ├── components/
    │   │   │   └── partner-filter/
    │   │   │   └── text-card/
    │   │   ├── services/
    │   │   │   └── partner.service.ts
    │   │   │   └── text-discovery.service.ts
    │   │   └── discovery.routes.ts
    │
    │   ├── content-management              // Uploading & managing own content
    │   │   ├── pages/
    │   │   │   └── upload-text/
    │   │   │   └── my-library/
    │   │   ├── components/
    │   │   │   └── file-uploader-ui/
    │   │   │   └── text-table/
    │   │   ├── services/
    │   │   │   └── upload.service.ts
    │   │   │   └── library.service.ts
    │   │   └── content.routes.ts
    │
    │   ├── clubs                           // Communities & group sessions
    │   │   ├── pages/
    │   │   │   └── club-feed/
    │   │   │   └── create-club/
    │   │   │   └── club-room/
    │   │   ├── components/
    │   │   │   └── club-post/
    │   │   │   └── club-card/
    │   │   ├── services/
    │   │   │   └── club.service.ts
    │   │   └── clubs.routes.ts
    │
    │   ├── notifications
    │   │   ├── pages/
    │   │   │   └── center/
    │   │   ├── components/
    │   │   │   └── notification-list/
    │   │   │   └── notification-bell/
    │   │   ├── models/
    │   │   │   └── notification.model.ts
    │   │   ├── services/
    │   │   │   └── notification.service.ts
    │   │   └── notifications.routes.ts

    └── environments/
        └── environment.ts
        └── environment.prod.ts


```
