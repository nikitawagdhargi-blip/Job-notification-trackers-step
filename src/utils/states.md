# Error & Empty State Guidelines

## Philosophy
- Errors must clearly explain what went wrong and how to fix it
- Never blame the user
- Empty states must guide next action
- Never leave blank screens

## Error States

### Visual Style
- Background: var(--white) with border
- Border: 1px solid var(--accent-primary) for errors
- Icon: Exclamation triangle icon in accent color
- Text: var(--text-primary) color

### Structure
1. **Clear headline** - What happened in simple terms
2. **Detailed explanation** - Why it happened
3. **Actionable solution** - What user can do to fix
4. **Primary action button** - Leading to solution

### Examples
```
┌─────────────────────────────────────┐
│ ⚠️ Something went wrong            │
│                                     │
│ We couldn't save your notification │
│ settings because the connection timed│
│ out. Please check your internet and │
│ try again.                         │
│                                     │
│ [Retry Settings Save] [Cancel]      │
└─────────────────────────────────────┘
```

## Empty States

### Visual Style
- Background: var(--white) or var(--bg-primary)
- Icon: Relevant illustration or simple icon
- Text: Centered, encouraging tone
- Primary action button: Clear next step

### Structure
1. **Friendly headline** - Positive but honest
2. **Brief explanation** - Why this is empty
3. **Clear next action** - What to do now
4. **Primary action button** - Leading to next step

### Examples
```
┌─────────────────────────────────────┐
│ 📭 No notifications yet            │
│                                     │
│ You haven't set up any job          │
│ notifications yet. Start by adding  │
│ your first one to get alerts when   │
│ new opportunities arrive.           │
│                                     │
│ [Add Your First Notification]       │
└─────────────────────────────────────┘
```

## Implementation Rules
- Always provide contextual help in error messages
- Use positive, helpful language
- Ensure error messages are actionable
- Include relevant illustrations in empty states
- Maintain consistent styling with the rest of the design system
- Never use technical jargon in user-facing messages