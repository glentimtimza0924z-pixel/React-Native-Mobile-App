# DevLab Master Compilation Mobile App
**Mobile Computing (CS 321) – Hands-on Activity (By Pair)**

A production-ready, multi-screen React Native (Expo) mobile application engineered with declarative UI architecture, modular reusable components, mobile-first responsive Flexbox layouts, and Context API global state management.

---

## 👥 Project Team & Authors
- **Partner 1**: `[Your Name]`
- **Partner 2**: `[Partner's Name]`
- **Course**: `CS 321 - Mobile Computing`
- **Section**: `BSCS 4-B`

> *Note: These parameters can be customized and updated in real-time from the **Settings** screen, which instantly synchronizes across the Home Dashboard greeting banner (`👥 [Your Name] & [Partner's Name]`) and headers across the application.*

---

## 📱 Core Architectural Features

### 1. Global State Management (Settings & Dashboard Sync)
- **`ThemeContext` (`src/context/ThemeContext.js`)**:
  - Manages global `theme` ('light' | 'dark').
  - Controlled by a native **Dark/Light Theme Toggle Switch** and visual segmented buttons on the **Settings Screen**, as well as a quick one-tap header button on the **Home Dashboard**.
  - Provides semantic color tokens for backgrounds, cards, typography, borders, and status bars that update instantaneously across the app without reloading.
- **`AppContext` (`src/context/AppContext.js`)**:
  - Manages global parameters: `pairNames` (default: `"[Your Name] & [Partner's Name]"`), `partner1`, `partner2`, `course`, and `section`.
  - Configurable in the dedicated **Settings Screen** with live real-time input fields.
  - Edits immediately sync to the Home Dashboard greeting (`👥 [Your Name] & [Partner's Name]`), course badges, and Pair profile views.

### 2. Mobile-First Responsive Flexbox Layout
- Specifically structured for mobile viewports using Flexbox (`flex: 1`, `flexDirection: 'row' | 'column'`, `justifyContent`, `alignItems`).
- Utilizes `ScrollView` with `showsVerticalScrollIndicator={false}` and `SafeAreaView` for seamless notch and edge protection.
- Fixed bottom navigation bar: Cleanly labeled `"Pair"` (avoiding any awkward wrapping or clipping), with optimized height and padding for iOS, Android, and Web browsers.
- Metric cards dynamically expand and contract with `flex: 1` in a responsive 2x2 grid without horizontal overflow on smaller screens.

### 3. Declarative Component Architecture & React Hooks
- **Reusable Primitives (`src/components/`)**:
  - `CustomButton`: Supports variants (`primary`, `secondary`, `outline`, `danger`, `success`), sizes (`sm`, `md`, `lg`), loading indicators, and icons.
  - `CustomCard`: Surface container with platform-adaptive light/dark drop shadows.
  - `MetricCard`: Statistical metric tile with icon badge and bold numerical counts.
  - `CustomInput`: Controlled text input with error state styling and clear buttons.
  - `Badge`: Status pills for completed, in progress, and pending items.
  - `SectionHeader` & `EmptyState`: Standardized layout headers and fallbacks.
- **Dynamic State-Driven Lab Management (CRUD)**:
  - All laboratory activities are managed dynamically in `AppContext`.
  - **Add New Lab**: Interactive modal sheet on the Labs screen allows students to register new activities dynamically with title, category, description, status (`Pending`, `In Progress`, `Completed`), and due date.
  - **Real-Time Stats Recalculation**: Adding or deleting activities immediately updates `total`, `completed`, `inProgress`, and `completionRate` across the Home Dashboard, Directory, and Profile screens in real time.
  - **Delete & Status Cycle**: Individual activities can be deleted with a confirmation alert or have their status cycled (`Pending` ➜ `In Progress` ➜ `Completed`).
- **Interactive UI with React Hooks (`useState` & `useEffect`)**:
  - `useState` powers the local modal visibility, input validations, search query filtering, and category selection.
  - `useEffect` actively drives reactive filtering on the Home Dashboard and Directory when switching between categories.

---

## 📁 File Structure
```
React Native Mobile App/
├── App.js                      # Root app entry with Context Providers
├── app.json                    # Expo configuration
├── babel.config.js             # Babel preset configuration
├── package.json                # Project dependencies & scripts
├── README.md                   # Complete documentation & activity guide
└── src/
    ├── constants/
    │   ├── colors.js           # Semantic Light & Dark color design system
    │   └── labsData.js         # Master laboratory dataset & activity specs
    ├── context/
    │   ├── ThemeContext.js     # Global theme state (Light / Dark)
    │   └── AppContext.js       # Global state for pair profile & lab statuses
    ├── components/
    │   ├── Badge.js            # Status tags & activity pills
    │   ├── CustomButton.js     # Reusable button with variant & size props
    │   ├── CustomCard.js       # Elevated card with platform shadows
    │   ├── CustomInput.js      # Controlled text input with live validation
    │   ├── MetricCard.js       # Responsive statistical metric tile
    │   ├── SectionHeader.js    # Standardized section heading
    │   └── EmptyState.js       # Fallback display for empty search results
    ├── navigation/
    │   └── AppNavigator.js     # Stack & Bottom Tab navigation (Dashboard, Labs, Pair, Settings)
    └── screens/
        ├── HomeScreen.js       # Main Dashboard & compilation launchpad
        ├── LabsScreen.js       # Searchable master lab directory
        ├── LabDetailScreen.js  # Interactive playgrounds (useState, Flexbox, Forms)
        ├── ProfileScreen.js    # Pair collaborators & rubric verification
        └── SettingsScreen.js   # Global theme & profile state synchronizer
```

---

## 🚀 How to Run the App

1. In your terminal inside the project directory:
   ```powershell
   npx expo start
   ```

2. Choose your platform:
   - **Web Browser**: Press <kbd>w</kbd> (opens in Chrome/Edge at `http://localhost:8081`).
   - **Mobile Phone**: Open **Expo Go** on your device and scan the displayed QR code.
   - **Android Emulator**: Press <kbd>a</kbd>.
