# Genre Filtering Feature Specification

## Overview
Add genre-based filtering to the movie app, allowing users to filter movies and TV series by selecting one or multiple genres. This feature will help users discover content in their preferred categories.

---

## Requirements

### Functional Requirements

#### FR1: Genre List Display
- Display a list of available movie/TV genres
- Genres should be fetched from TMDB API
- Show genres as clickable chips/buttons in the UI
- Display genre list on catalog/browse pages

#### FR2: Single Genre Filter
- Users can click on a genre to filter content
- Only movies/shows from the selected genre are displayed
- Active genre should be visually highlighted
- Clicking the same genre again should clear the filter

#### FR3: Multi-Genre Filter (Optional - Phase 2)
- Users can select multiple genres simultaneously
- Results show movies/shows that match ANY of the selected genres
- Clear visual indicator for all selected genres
- "Clear All" button to reset filters

#### FR4: Filter Persistence
- Selected genre filters persist when navigating between pages
- Filters reset when user leaves the catalog section
- URL should reflect active filters (e.g., `/movies?genre=28,12`)

#### FR5: Results Display
- Show filtered results in a grid layout (consistent with current design)
- Display loading state while fetching filtered results
- Show empty state if no results found for selected genre(s)
- Include result count (e.g., "Showing 24 Action movies")

### Non-Functional Requirements

#### NFR1: Performance
- Genre list should load quickly (< 500ms)
- Filtering should feel instant (optimistic updates)
- Debounce API calls if multiple genres selected rapidly

#### NFR2: Usability
- Filter UI should be intuitive and accessible
- Mobile-responsive design
- Clear visual feedback for user actions
- Keyboard navigation support

#### NFR3: Maintainability
- Reusable filter component for both movies and TV shows
- Clean separation of concerns (UI, state, API)
- Well-documented code

---

## Design Approach

### Architecture

```
┌─────────────────────────────────────────┐
│         Catalog Page (Movies/TV)         │
└─────────────────┬───────────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
┌───────▼────────┐  ┌──────▼────────┐
│ GenreFilter    │  │  ContentGrid   │
│ Component      │  │  Component     │
└───────┬────────┘  └──────▲────────┘
        │                   │
        │         ┌─────────┴─────────┐
        │         │                   │
┌───────▼─────────▼───────┐  ┌───────┴────────┐
│  Redux State (Filter)    │  │  TMDB API      │
│  - selectedGenres        │  │  - getGenres   │
│  - genreList            │  │  - getMovies   │
└──────────────────────────┘  └────────────────┘
```

### State Management

**Redux Slice: `filterSlice`**
```typescript
{
  genres: {
    movie: Genre[],
    tv: Genre[]
  },
  selectedGenres: number[],
  isLoading: boolean
}
```

### Component Hierarchy

```
CatalogPage
├── GenreFilter
│   ├── GenreChip (multiple)
│   └── ClearFiltersButton
└── ContentGrid
    └── MovieCard (multiple)
```

---

## Recommended Tech Stack

### Existing Stack (Leverage These)
- **React** - UI components
- **TypeScript** - Type safety
- **Redux Toolkit** - State management
- **Tailwind CSS** - Styling
- **React Router** - URL state management

### New/Enhanced Dependencies
- **No new dependencies required!** - Use existing stack

### Key Technologies by Layer

#### 1. Data Layer
- **Redux Toolkit**: Manage filter state
- **RTK Query** (already in toolkit): API calls with caching
- **TMDB API**: Genre and movie endpoints

#### 2. UI Layer
- **Tailwind CSS**: Style genre chips and filters
- **Framer Motion** (already included): Smooth animations
- **React Icons** (already included): Filter icons

#### 3. Routing Layer
- **React Router**: Sync filters with URL query params
- **useSearchParams**: Read/write URL state

---

## Implementation Phases

### Phase 1: Basic Single Genre Filter (MVP)
**Goal:** Filter by one genre at a time

**Tasks:**
1. Create `GenreFilter` component
2. Add Redux slice for filter state
3. Fetch genres from TMDB API
4. Display genre chips
5. Filter movies when genre selected
6. Add loading and empty states

**Testing:** Manually test selecting different genres and verify results update

---

### Phase 2: Multi-Genre Selection
**Goal:** Allow multiple genre selection

**Tasks:**
1. Update state to handle array of genres
2. Modify UI to show multiple active genres
3. Add "Clear All" functionality
4. Update API call to include multiple genres

**Testing:** Select 2-3 genres and verify results match any of them

---

### Phase 3: URL Integration & Polish
**Goal:** Persist filters in URL and add refinements

**Tasks:**
1. Sync selected genres with URL query params
2. Read URL params on page load
3. Add animations for smooth transitions
4. Add result count display
5. Optimize performance (memoization, debouncing)

**Testing:** Share URL with filters and verify they load correctly

---

## TMDB API Endpoints

### 1. Get Movie Genres
```
GET https://api.themoviedb.org/3/genre/movie/list
Response: { genres: [{ id: 28, name: "Action" }, ...] }
```

### 2. Get TV Genres
```
GET https://api.themoviedb.org/3/genre/tv/list
Response: { genres: [{ id: 10759, name: "Action & Adventure" }, ...] }
```

### 3. Discover Movies by Genre
```
GET https://api.themoviedb.org/3/discover/movie?with_genres=28,12
Parameters:
  - with_genres: Comma-separated genre IDs (OR logic)
  - page: Pagination
```

### 4. Discover TV Shows by Genre
```
GET https://api.themoviedb.org/3/discover/tv?with_genres=10759
```

---

## UI/UX Design

### Genre Filter Component Layout

```
┌─────────────────────────────────────────────┐
│  Filter by Genre:                           │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌─────┐ │
│  │ Action │ │ Comedy │ │ Drama  │ │ ... │ │
│  └────────┘ └────────┘ └────────┘ └─────┘ │
│  [Clear Filters]                            │
└─────────────────────────────────────────────┘
```

### Genre Chip States
- **Default**: Gray background, gray text
- **Hover**: Darker background, pointer cursor
- **Active/Selected**: Primary color (e.g., blue), white text
- **Disabled**: Faded, no cursor

### Empty State
```
┌─────────────────────────────────────┐
│           🎬                        │
│   No movies found for this genre    │
│   Try selecting different genres    │
│   [Clear Filters]                   │
└─────────────────────────────────────┘
```

---

## File Structure

```
movie-app/
├── src/
│   ├── common/
│   │   ├── GenreFilter/
│   │   │   ├── index.tsx          # Main filter component
│   │   │   ├── GenreChip.tsx      # Individual chip component
│   │   │   └── GenreFilter.styles.ts  # Tailwind classes
│   │   └── ...
│   ├── services/
│   │   ├── genreApi.ts            # API calls for genres
│   │   └── tmdbApi.ts             # (existing, update)
│   ├── store/
│   │   ├── filterSlice.ts         # Redux slice for filters
│   │   └── store.ts               # (existing, update)
│   ├── hooks/
│   │   └── useGenreFilter.ts      # Custom hook for filter logic
│   ├── types/
│   │   └── genre.types.ts         # TypeScript types
│   └── pages/
│       ├── Catalog/               # Update to use filters
│       └── ...
└── specs/
    └── genre-filtering-spec.md    # This file
```

---

## Testing Strategy

### Manual Testing Checklist

#### Phase 1 Testing
- [ ] Genre list loads on page mount
- [ ] Clicking genre filters results correctly
- [ ] Active genre is visually highlighted
- [ ] Clicking same genre deselects it
- [ ] Loading spinner shows while fetching
- [ ] Empty state displays when no results
- [ ] Works for both Movies and TV Shows pages

#### Phase 2 Testing
- [ ] Can select multiple genres
- [ ] Results show content matching ANY selected genre
- [ ] Clear All button removes all filters
- [ ] All selected genres highlighted correctly

#### Phase 3 Testing
- [ ] URL updates when genre selected
- [ ] Filters load from URL on page refresh
- [ ] Shared URLs work correctly
- [ ] Browser back/forward buttons work
- [ ] Mobile responsive on small screens
- [ ] Keyboard navigation works (Tab, Enter, Space)

### Edge Cases to Test
- No internet connection
- TMDB API rate limiting
- Selecting genre with 0 results
- Very long genre names (text overflow)
- Rapid clicking (debouncing)

---

## Success Metrics

### User Experience
- Users can find desired content faster
- Reduced scrolling/searching time
- Increased engagement with catalog pages

### Technical
- Filter response time < 500ms
- No UI blocking during API calls
- Clean, maintainable code structure

---

## Future Enhancements (Out of Scope)

- Combined filters (genre + rating + year)
- Genre-based recommendations
- Save favorite genres in user preferences
- Advanced filters (AND logic vs OR logic)
- Filter animations and transitions
- Genre popularity indicators

---

## Notes & Considerations

1. **API Key Usage**: Ensure rate limits are respected (40 requests/10 seconds for TMDB)
2. **Caching**: Consider caching genre lists (they rarely change)
3. **Accessibility**: Add ARIA labels for screen readers
4. **Performance**: Use React.memo for genre chips to prevent unnecessary re-renders
5. **Error Handling**: Gracefully handle API failures with retry logic

---

## Getting Started

To implement this spec:

1. Start with **Phase 1** - get basic filtering working
2. Test thoroughly before moving to Phase 2
3. Review and iterate based on user feedback
4. Keep PRs small and focused on one phase at a time

---

**Document Version:** 1.0
**Last Updated:** 2026-02-03
**Author:** Claude Code
**Status:** Ready for Implementation
