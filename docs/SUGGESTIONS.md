# Verified Care - Development Suggestions & Roadmap

## Project Overview

Verified Care is an NDIS Provider Marketplace connecting participants with verified providers for domestic cleaning, community transport, and yard maintenance across all Australian states.

---

## Suggested Next Steps

### 1. Start Coding a Specific Module

**Priority modules to implement:**

#### A. Provider Onboarding Flow
- Registration with ABN verification
- Document upload (insurance, qualifications, police checks)
- Service area and pricing setup
- Profile completion wizard
- Compliance checklist dashboard

#### B. Booking Flow
- Provider search with filters
- Fair Price Score display
- Service selection and scheduling
- Dual confirmation system
- GPS check-in/check-out

#### C. Participant Dashboard
- Budget tracking (plan-managed vs self-managed)
- Upcoming bookings view
- Action items and notifications
- Provider review system

#### D. Support Coordinator Portal
- Multi-participant management
- Booking on behalf functionality
- Conflict of interest disclosure
- Transparency reporting

---

### 2. Set Up PostgreSQL Locally

**Docker Compose setup recommended:**

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: verified_care
      POSTGRES_PASSWORD: your_secure_password
      POSTGRES_DB: verified_care_dev
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

**Steps:**
1. Save as `docker-compose.yml` in project root
2. Run `docker-compose up -d`
3. Update `.env` with connection string
4. Run `pnpm db:push` to sync schema

---

### 3. Build Out More UI Components

**Priority components to create:**

#### Cards
- `ProviderCard` - Display provider with Fair Price Score
- `BookingCard` - Show booking details and status
- `AlertCard` - Notifications and action items
- `StatsCard` - Dashboard metrics

#### Forms
- `Input` - Text input with validation states
- `Select` - Dropdown selection
- `DatePicker` - Date/time selection
- `Checkbox` / `Toggle` - Boolean inputs
- `FileUpload` - Document upload with preview

#### Navigation
- `TopNav` - Main navigation header
- `BottomNav` - Mobile navigation
- `Sidebar` - Desktop dashboard navigation
- `Breadcrumbs` - Page hierarchy

#### Feedback
- `Toast` - Notification messages
- `Modal` - Dialogs and confirmations
- `ProgressBar` - Multi-step progress
- `LoadingSpinner` - Loading states

---

### 4. Create API Endpoints

**Priority endpoints:**

#### Authentication
```
POST /auth/register
POST /auth/login
POST /auth/refresh
POST /auth/forgot-password
POST /auth/reset-password
GET  /auth/me
```

#### Providers
```
GET    /providers              # List with filters
GET    /providers/:id          # Provider details
POST   /providers              # Register provider
PATCH  /providers/:id          # Update provider
GET    /providers/:id/services # Provider services
POST   /providers/:id/documents # Upload documents
```

#### Bookings
```
GET    /bookings               # List bookings
POST   /bookings               # Create booking
GET    /bookings/:id           # Booking details
PATCH  /bookings/:id/confirm   # Confirm booking
POST   /bookings/:id/check-in  # GPS check-in
POST   /bookings/:id/check-out # GPS check-out
```

#### Invoices
```
GET    /invoices               # List invoices
POST   /invoices               # Create invoice
GET    /invoices/:id           # Invoice details
PATCH  /invoices/:id/confirm   # Dual confirmation
```

---

## Integration Roadmap

### Phase 0 - MVP (Launch)
| Integration | Purpose | Priority |
|-------------|---------|----------|
| Stripe | Payments | P0 |
| Twilio | SMS notifications | P0 |
| SendGrid | Email delivery | P0 |
| ABN Lookup | Business verification | P0 |
| Google Maps | Location services | P0 |
| AWS S3 | Document storage | P0 |
| Sentry | Error tracking | P0 |

### Phase 1 - Post-Launch
| Integration | Purpose | Priority |
|-------------|---------|----------|
| Worker Screening | Background checks | P1 |
| Firebase Cloud Messaging | Push notifications | P1 |
| DocuSign | Digital signatures | P1 |
| Google/Outlook Calendar | Calendar sync | P1 |

### Phase 2 - Growth
| Integration | Purpose | Priority |
|-------------|---------|----------|
| Xero/MYOB | Accounting | P2 |
| PayTo | Direct payments | P2 |
| WhatsApp Business | Messaging | P2 |
| Plan Manager APIs | NDIS billing | P2 |

### Phase 3 - Scale
| Integration | Purpose | Priority |
|-------------|---------|----------|
| MyGovID | Identity verification | P3 |
| Auslan Services | Accessibility | P3 |
| Public API | Partner access | P3 |

---

## Unique Features to Implement

### 1. Fair Price Score Algorithm
```typescript
function calculateFairPriceScore(
  rate: number,
  ndisCapRate: number,
  rating: number,
  responseTimeHours: number,
  completionRate: number
): number {
  // Price component (40% weight) - lower is better
  const priceRatio = rate / ndisCapRate;
  const priceScore = Math.max(0, 100 - (priceRatio - 0.7) * 150);

  // Quality component (35% weight)
  const qualityScore = rating * 20;

  // Reliability component (25% weight)
  const responseScore = Math.max(0, 100 - responseTimeHours * 5);
  const reliabilityScore = (responseScore + completionRate) / 2;

  return Math.round(
    priceScore * 0.4 + qualityScore * 0.35 + reliabilityScore * 0.25
  );
}
```

### 2. Dual Confirmation System
- Participant confirms service completed
- Provider confirms service delivered
- Both must confirm before invoice generates
- Dispute flow if confirmations don't match

### 3. Coordinator Conflict Detection
- Track coordinator-provider relationships
- Flag when coordinator books their affiliated providers
- Require participant acknowledgment
- Transparency reporting for NDIS compliance

### 4. GPS Geofenced Check-in/Check-out
- Provider must be within service location radius
- Automatic time tracking
- Photo verification option
- Offline support for regional areas

---

## Technical Debt to Address

### Short-term
- [ ] Add comprehensive test coverage
- [ ] Set up CI/CD pipeline
- [ ] Implement proper error handling
- [ ] Add API rate limiting
- [ ] Configure logging and monitoring

### Medium-term
- [ ] Performance optimization (caching, query optimization)
- [ ] Implement proper search with Meilisearch
- [ ] Add WebSocket for real-time updates
- [ ] Mobile app consideration (React Native)

### Long-term
- [ ] Multi-tenancy for white-label
- [ ] Advanced analytics dashboard
- [ ] Machine learning for provider matching
- [ ] API for third-party integrations

---

## Questions to Consider

1. **Plan Management**: Will you integrate with specific plan managers, or start with self-managed participants only?

2. **Compliance Verification**: Manual verification or automated via API (e.g., Worker Screening Check API)?

3. **Payment Flow**: Hold funds in escrow until dual confirmation, or direct provider payment?

4. **Geographic Scope**: Launch in one state first (e.g., VIC) or national from day one?

5. **Provider Vetting**: How rigorous should the initial onboarding be?

---

## Recommended Development Order

1. **Week 1-2**: Authentication & User Management
2. **Week 3-4**: Provider Module (registration, profile, services)
3. **Week 5-6**: Booking Flow (search, create, confirm)
4. **Week 7-8**: Invoicing & Payments
5. **Week 9-10**: Dashboard & Reporting
6. **Week 11-12**: Testing, Polish, Launch Prep

---

*Document created: January 2026*
*Project: Verified Care NDIS Platform*
