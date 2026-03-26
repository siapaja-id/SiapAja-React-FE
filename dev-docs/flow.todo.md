=== DONE

the App Layer:
├── Display: Static map tiles (OSM/Mapbox free tier) or coordinate list
├── Logic: Route calculation via OSRM or Mapbox Directions API (cheaper)
└── Action: Deep link button → External Google Maps for final navigation

so please adjust the UI UX0

["src/features/feed/components/TaskMainContent.Component.tsx", "src/features/feed/components/FeedItems.Component.tsx", "src/features/feed/components/TaskMainContent.Component.tsx", "src/shared/types/domain.type.ts", "src/shared/constants/domain.constant.tsx", "src/features/gigs/components/GigMatcher.Component.tsx", "src/features/gigs/pages/ReviewOrder.Page.tsx", "src/features/gigs/pages/Payment.Page.tsx", "src/features/gigs/components/MatchSuccess.Component.tsx", "src/App.tsx"]

===

we need empty comment state to encourage reader to give reactions

["src/features/feed/pages/PostDetail.Page.tsx", "src/features/feed/components/FeedItems.Component.tsx", "src/shared/ui/SharedUI.Component.tsx", "src/shared/ui/PostActions.Component.tsx", "src/store/feed.slice.ts", "src/shared/types/domain.type.ts"]

===

Fullscreen mode reply with UX similar to post creation

["src/features/feed/pages/PostDetail.Page.tsx", "src/features/feed/pages/CreatePost.Page.tsx", "src/shared/ui/SharedUI.Component.tsx", "src/features/creation/components/CreateModal.Component.tsx"]

===

we need:

- first post indicator
- author indicator
- profile online indicator

["src/features/feed/components/FeedItems.Component.tsx", "src/features/profile/pages/Profile.Page.tsx", "src/shared/ui/SharedUI.Component.tsx", "src/shared/types/domain.type.ts", "src/shared/constants/domain.constant.tsx", "src/App.tsx"]

===

we need sliver parallax effect for mobile native UX feel on post/task detail and profile page

["src/features/feed/pages/PostDetail.Page.tsx", "src/features/feed/components/TaskMainContent.Component.tsx", "src/features/profile/pages/Profile.Page.tsx", "src/shared/ui/SharedUI.Component.tsx", "src/index.css"]

===

post/task detail/replies : they should has triple dot action button

["src/features/feed/pages/PostDetail.Page.tsx", "src/features/feed/components/FeedItems.Component.tsx", "src/features/feed/components/TaskMainContent.Component.tsx", "src/shared/ui/PostActions.Component.tsx", "src/shared/ui/SharedUI.Component.tsx"]

===

post detail : follow button at right inline with profile header

["src/features/feed/pages/PostDetail.Page.tsx", "src/features/feed/components/FeedItems.Component.tsx", "src/features/profile/pages/Profile.Page.tsx", "src/shared/ui/SharedUI.Component.tsx", "src/store/main.store.ts"]

===

improve UX let's make the text interactive by

- link preview
- @ mentions
- etc

["src/features/feed/components/FeedItems.Component.tsx", "src/features/feed/pages/CreatePost.Page.tsx", "src/shared/ui/SharedUI.Component.tsx", "src/shared/types/domain.type.ts", "src/features/creation/components/CreateModal.Component.tsx"]

===

post action : vote at right , rest at left

["src/shared/ui/PostActions.Component.tsx", "src/features/feed/components/FeedItems.Component.tsx", "src/features/feed/pages/PostDetail.Page.tsx", "src/features/feed/components/TaskMainContent.Component.tsx"]

===

beautiful gig input field at top of feed content. to encourage people to post task. the content then as first chat for the ai chatroom

["src/App.tsx", "src/features/creation/components/CreateModal.Component.tsx", "src/features/creation/components/AIChatRequest.Component.tsx", "src/features/feed/pages/CreatePost.Page.tsx", "src/features/feed/components/FeedItems.Component.tsx", "src/features/chat/components/ChatRoom.Component.tsx", "src/store/main.store.ts", "src/store/app.slice.ts"]

===

karma points in feed header beside profil picture

["src/App.tsx", "src/features/profile/pages/Profile.Page.tsx", "src/shared/ui/SharedUI.Component.tsx", "src/shared/types/domain.type.ts", "src/shared/constants/domain.constant.tsx", "src/store/app.slice.ts"]

=== DONE

we want project pages and components to be within Feature-Based App Structure so I can save llm tokens for referencing certain task by selecting context on certain feature/s

=== DONE

vertical scrollbar should be hidden

=== DONE

we want to have consistent UI UX across pages

===

the AI can decide wether to create job as instant matching vs feed bidding

["src/features/creation/components/AIChatRequest.Component.tsx", "src/features/gigs/components/GigMatcher.Component.tsx", "src/features/gigs/pages/ReviewOrder.Page.tsx", "src/features/gigs/pages/Payment.Page.tsx", "src/features/gigs/components/MatchSuccess.Component.tsx", "src/store/order.slice.ts", "src/store/main.store.ts", "src/shared/types/domain.type.ts", "src/App.tsx"]


=== DONE

if posting updates can be multiple threads, then we need post example and UIUX that shows that multiple threads as comments just like meta threads did

 "src/pages/CreatePost.Page.tsx",
  "src/pages/PostDetail.Page.tsx",
  "src/components/FeedItems.Component.tsx",
  "src/components/PostActions.Component.tsx",
  "src/components/SharedUI.Component.tsx",
  "src/types/domain.type.ts",
  "src/store/feed.slice.ts",
  "src/constants/domain.constant.tsx",
  "src/App.tsx"

=== DONE

we need react route 7 without UI UX Regression

=== DONE

we need amazing profile page with different actions and view for me vs other mode

=== DONE

give me relevant path files for below task in json array string format, task: post and replies can quote another post and task

post and replies can quote another post and task

=== DONE

header: should show content view stat, currenly viewing stat. content type: post, task , reply.

=== DONE

task detail: reader vs creator should has different actions options.

post detail: reader vs creator should has different actions options.

=== DONE

in meta threads app, the feed that has long text content, there is read more to reveal.. we also need that... also in task detail content .

=== DONE

task detail page still look like a web page... we want cohesive mobile app experience. also add depth to UI

=== DONE

implement the most cohesive bidding feature

=== DONE

implement comprehensive zustand *.store.tsx *.slice.tsx files and *.constant.ts *.type.ts files

=== DONE

can we achieve high DRYness without UI UX regressions? especially on post detail reply area and task detail reply area basically, each reply are post.  the flat threaded drill down UX should be perfect and DRY.

=== DONE

We want framer-motion only.

=== DONE

can we achieve high DRYness without UI UX regressions? for less

===

please update dev-docs/flow.todo.md by analysing each undone todos then give each todo a json array of string paths of relevant files so another llm can look for the files to work on the task with full context
