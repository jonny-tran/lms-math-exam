# Classes & Subjects Integration Guide

> Applies to the Teacher role in the Next.js 16 + App Router stack in `lms-math-exam`.

## 1. Overview

The Classes and Subjects management layer is built on:

- **Axios** for HTTP calls (`lib/http.ts`)
- **React Hook Form + Zod** for form validation
- **Sonner** toaster for UX feedback
- **TanStack Table** for data table display (Classes)
- **Grid Card Layout** for subject display (Subjects)
- **Custom service layer** for API isolation
- **Teacher identity hook** for role verification

All requests target the API specified by `NEXT_PUBLIC_API_URL`.

## 2. Relationship Model

**Subjects** → **Classes** (One-to-Many)

- One subject can have multiple classes
- Multiple classes belong to one subject
- Subjects are created by teachers (`teacherId`)
- Classes reference a subject (`subjectId`) and a teacher (`teacherId`)

## 3. Required Packages & Environment

| Package              | Purpose                          |
|----------------------|----------------------------------|
| `axios`              | HTTP client                      |
| `react-hook-form`    | Form state management            |
| `zod`                | Schema validation                |
| `@hookform/resolvers`| Zod resolver for react-hook-form |
| `sonner`             | Toast notifications              |
| `@tanstack/react-table` | Data table (Classes)           |
| `date-fns`           | Date formatting                  |

Environment:

```bash
NEXT_PUBLIC_API_URL=https://your-api-domain
```

## 4. File Structure

### Types

| File                    | Responsibility                                  |
|-------------------------|-------------------------------------------------|
| `types/class.ts`        | `ClassDto`, `ClassSummaryDto`, `CreateClassRequest`, `UpdateClassRequest` |
| `types/subject.ts`      | `SubjectDto`, `SubjectSummaryDto`, `CreateSubjectRequest`, `UpdateSubjectRequest` |

### Services

| File                      | Responsibility                    |
|---------------------------|-----------------------------------|
| `services/class-service.ts`   | CRUD operations for classes       |
| `services/subject-service.ts` | CRUD operations for subjects      |

### Hooks

| File                          | Responsibility                           |
|-------------------------------|------------------------------------------|
| `hooks/use-teacher-identity.ts` | Resolves teacher ID from current user    |

### Components (Classes)

| File                                     | Responsibility                                    |
|------------------------------------------|---------------------------------------------------|
| `components/teachers/classes/columns.tsx`     | Table column definitions with action handlers     |
| `components/teachers/classes/class-data-table.tsx` | Data table wrapper with pagination/filtering      |
| `components/teachers/classes/class-form-dialog.tsx` | Create/Edit form dialog with validation           |
| `components/teachers/classes/class-detail-dialog.tsx` | View-only detail dialog                          |

### Components (Subjects)

| File                                       | Responsibility                          |
|--------------------------------------------|-----------------------------------------|
| `components/teachers/subjects/subject-card.tsx`      | Grid card component with actions        |
| `components/teachers/subjects/subject-form-dialog.tsx` | Create/Edit form dialog                 |
| `components/teachers/subjects/subject-detail-dialog.tsx` | View detail dialog with classes list   |

### Pages

| File                          | Responsibility                                    |
|-------------------------------|---------------------------------------------------|
| `app/teachers/classes/page.tsx`   | Classes management page (Table view)             |
| `app/teachers/subjects/page.tsx`  | Subjects management page (Grid card view)        |

## 5. Data Models

### SubjectDto

```typescript
interface SubjectDto {
  subjectId: number;
  teacherId: number;
  title: string;
  description: string;
  createdAt: string; // ISO Date
  updatedAt: string | null; // ISO Date
  teacherName: string;
  classes?: ClassSummaryDto[]; // Optional, populated when fetching details
}
```

### ClassDto

```typescript
interface ClassDto {
  classId: number;
  subjectId: number;
  teacherId: number;
  name: string;
  schedule: string;
  startDate: string; // ISO Date
  endDate: string | null; // ISO Date
  createdAt: string; // ISO Date
  subjectTitle: string | null;
  teacherName: string;
  enrolledStudents: ClassEnrollmentDto[];
}
```

## 6. API Endpoints

### Subjects API

| Method   | Endpoint              | Request Body                    | Response              |
|----------|-----------------------|---------------------------------|-----------------------|
| `GET`    | `/subjects`           | -                               | `SubjectDto[]`        |
| `GET`    | `/subjects/{id}`      | -                               | `SubjectDto`          |
| `POST`   | `/subjects`           | `CreateSubjectRequest`          | `SubjectDto`          |
| `PUT`    | `/subjects/{id}`      | `UpdateSubjectRequest`          | `SubjectDto`          |
| `DELETE` | `/subjects/{id}`      | -                               | `void`                |

**Request Types:**

```typescript
interface CreateSubjectRequest {
  teacherId: number;
  title: string;
  description: string;
}

interface UpdateSubjectRequest {
  teacherId: number;
  title: string;
  description: string;
}
```

### Classes API

| Method   | Endpoint           | Request Body             | Response      |
|----------|--------------------|--------------------------|---------------|
| `GET`    | `/classes`         | -                        | `ClassDto[]`  |
| `GET`    | `/classes/{id}`    | -                        | `ClassDto`    |
| `POST`   | `/classes`         | `CreateClassRequest`     | `ClassDto`    |
| `PUT`    | `/classes/{id}`    | `UpdateClassRequest`     | `ClassDto`    |
| `DELETE` | `/classes/{id}`    | -                        | `void`        |

**Request Types:**

```typescript
interface CreateClassRequest {
  subjectId: number;
  teacherId: number;
  name: string;
  schedule: string;
  startDate: string; // ISO Date
  endDate: string | null; // ISO Date
}

type UpdateClassRequest = CreateClassRequest;
```

## 7. Services Layer

### Class Service (`services/class-service.ts`)

Functions:

- `getAllClasses()` → `GET /classes`
- `getClassById(id)` → `GET /classes/{id}`
- `createClass(payload)` → `POST /classes`
- `updateClass(id, payload)` → `PUT /classes/{id}`
- `deleteClass(id)` → `DELETE /classes/{id}`

Errors are rethrown (AxiosError) for the page component to handle.

### Subject Service (`services/subject-service.ts`)

Functions:

- `getAllSubjects()` → `GET /subjects`
- `getSubjectById(id)` → `GET /subjects/{id}`
- `createSubject(payload)` → `POST /subjects`
- `updateSubject(id, payload)` → `PUT /subjects/{id}`
- `deleteSubject(id)` → `DELETE /subjects/{id}`

Errors are rethrown (AxiosError) for the page component to handle.

## 8. Teacher Identity Hook

### `hooks/use-teacher-identity.ts`

Exposes:

- `teacherId: number | null`
- `isLoading: boolean`
- `error: string | null`
- `refresh()` - Manual refresh function

Behavior:

- On mount: fetches current user via `authService.getCurrentUser()`
- Extracts `teacherId` from user data
- Persists teacher ID in localStorage for quick access
- Provides error state if teacher verification fails
- Returns `null` for `teacherId` if user is not a teacher or not authenticated

## 9. UI Integration

### Classes Page (`app/teachers/classes/page.tsx`)

**Features:**

- **Data Table View**: Uses TanStack Table for sorting, filtering, pagination
- **Teacher Filtering**: Automatically filters classes by `teacherId`
- **CRUD Operations**: Full create, read, update, delete functionality
- **Subject Selection**: Requires subjects to exist before creating classes
- **Date Validation**: Ensures end date is after start date
- **Detail View**: Separate dialog to view full class details with enrolled students
- **Delete Confirmation**: AlertDialog confirms before hard delete

**State Management:**

```typescript
// Data state
const [classes, setClasses] = useState<ClassDto[]>([]);
const [subjects, setSubjects] = useState<SubjectDto[]>([]);

// UI state
const [isCreateOpen, setIsCreateOpen] = useState(false);
const [isEditOpen, setIsEditOpen] = useState(false);
const [isViewOpen, setIsViewOpen] = useState(false);
const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

// Loading states
const [isDataLoading, setIsDataLoading] = useState(false);
const [isCreateSubmitting, setIsCreateSubmitting] = useState(false);
const [isEditSubmitting, setIsEditSubmitting] = useState(false);
const [isDeleteSubmitting, setIsDeleteSubmitting] = useState(false);
```

**Data Flow:**

1. On mount: `useTeacherIdentity()` resolves teacher ID
2. Once `teacherId` is available: `loadData()` fetches classes and subjects
3. Classes are filtered by `teacherId` before displaying
4. User actions trigger appropriate API calls with error handling

**Error Handling:**

- Uses `getErrorMessage()` helper to extract error messages from Axios errors
- Displays errors via Sonner toast notifications
- Error messages shown in both toast and inline form errors

### Subjects Page (`app/teachers/subjects/page.tsx`)

**Features:**

- **Grid Card View**: Responsive grid layout (1/2/3/4 columns based on screen size)
- **Search Functionality**: Filters by title, description, or teacher name
- **CRUD Operations**: Full create, read, update, delete functionality
- **Teacher Filtering**: Automatically filters subjects by `teacherId`
- **Detail View**: Dialog shows subject details with list of associated classes
- **Delete Confirmation**: AlertDialog confirms before hard delete

**State Management:**

```typescript
// Data state
const [subjects, setSubjects] = useState<SubjectDto[]>([]);

// UI state
const [isCreateOpen, setIsCreateOpen] = useState(false);
const [isEditOpen, setIsEditOpen] = useState(false);
const [isViewOpen, setIsViewOpen] = useState(false);
const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
const [searchQuery, setSearchQuery] = useState("");

// Loading states
const [isDataLoading, setIsDataLoading] = useState(false);
const [isCreateSubmitting, setIsCreateSubmitting] = useState(false);
const [isEditSubmitting, setIsEditSubmitting] = useState(false);
const [isDeleteSubmitting, setIsDeleteSubmitting] = useState(false);
```

**Search Implementation:**

```typescript
const filteredSubjects = useMemo(() => {
  if (!searchQuery.trim()) {
    return subjects.filter((subject) => subject.teacherId === teacherId);
  }

  const query = searchQuery.toLowerCase();
  return subjects.filter(
    (subject) =>
      subject.teacherId === teacherId &&
      (subject.title.toLowerCase().includes(query) ||
        subject.description?.toLowerCase().includes(query) ||
        subject.teacherName?.toLowerCase().includes(query))
  );
}, [subjects, teacherId, searchQuery]);
```

**Grid Layout:**

```tsx
<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  {filteredSubjects.map((subject) => (
    <SubjectCard key={subject.subjectId} subject={subject} {...handlers} />
  ))}
</div>
```

## 10. Form Validation

### Class Form Schema

```typescript
const classFormSchema = z
  .object({
    name: z.string().min(1, "Please enter the class name."),
    schedule: z.string().min(1, "Please enter the class schedule."),
    subjectId: z.number().int().min(1, "Please select a subject."),
    teacherId: z.number().int(),
    startDate: z.date({ message: "Please select the start date." }),
    endDate: z.date().nullable(),
  })
  .refine(
    (values) =>
      !values.endDate ||
      (values.startDate &&
        values.endDate.getTime() > values.startDate.getTime()),
    {
      path: ["endDate"],
      message: "End date must be after start date.",
    }
  );
```

### Subject Form Schema

```typescript
const subjectFormSchema = z.object({
  teacherId: z.number().int(),
  title: z.string().min(1, "Please enter the subject title."),
  description: z.string().min(1, "Please enter the subject description."),
});
```

## 11. Component Patterns

### Dialog Pattern (Create/Edit Forms)

Both classes and subjects use the same dialog pattern:

1. **Mode-based**: Single component handles both "create" and "edit" modes
2. **Form Reset**: Form resets when dialog opens via `useEffect`
3. **Loading States**: Separate loading states for fetching details vs submitting
4. **Validation**: Uses react-hook-form with zod resolver
5. **Error Handling**: Form errors displayed inline, API errors via toast

### Detail Dialog Pattern

- Read-only view of full entity data
- Fetches full details on open (including nested relationships)
- Displays all fields in a structured layout
- Shows loading spinner while fetching

### Card Component Pattern (Subjects)

- Self-contained card with header, content, footer
- Dropdown menu for actions (View, Edit, Delete)
- Displays key information at a glance
- Button in footer for quick detail view

### Data Table Pattern (Classes)

- Uses TanStack Table for advanced features
- Column definitions with custom cell renderers
- Action column with dropdown menu
- Pagination, sorting, column visibility controls
- Server-side filtering by `teacherId`

## 12. Error Handling

### Error Message Extraction

```typescript
const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { error?: string; message?: string };
    return data?.error ?? data?.message ?? error.message;
  }

  return (error as Error).message ?? "An error has occurred.";
};
```

### Error Display Strategy

- **API Errors**: Displayed via Sonner toast (`toast.error()`)
- **Form Validation Errors**: Displayed inline via `FormMessage` component
- **Loading Errors**: Shown in error state UI with retry button
- **Delete Errors**: Shown in toast, prevents dialog from closing

## 13. Toast & UX

- All CRUD actions (success/failure) fire Sonner toasts in English
- Success messages:
  - "A new class has been created."
  - "Class has been updated."
  - "Class has been deleted."
  - "A new subject has been created."
  - "Subject has been updated."
  - "Subject has been deleted."
- Error messages extracted from API response
- No page reloads on failure
- Loading states prevent duplicate submissions

## 14. Sidebar Integration

### Subjects Navigation

Added to `components/teachers/dashboard/app-sidebar.tsx`:

```typescript
const navMain = [
  { title: "Dashboard", url: "/teachers/dashboard", icon: IconDashboard },
  { title: "Subjects", url: "/teachers/subjects", icon: IconBooks }, // Added
  { title: "Classes", url: "/teachers/classes", icon: IconSchool },
  // ... other items
];
```

Subjects menu item appears after Dashboard and before Classes, using `IconBooks` from `@tabler/icons-react`.

## 15. Testing Tips

1. **Teacher Identity**: Ensure `useTeacherIdentity()` hook correctly resolves teacher ID from authenticated user.

2. **Subject Dependencies**: When creating a class, ensure at least one subject exists for the teacher. The form will show an error if no subjects are available.

3. **Date Validation**: Test that end date validation works correctly—end date must be after start date.

4. **Filtering**: Verify that classes and subjects are correctly filtered by `teacherId`—teachers should only see their own data.

5. **Delete Operations**: Test delete operations with subjects that have classes. Backend may prevent deletion if there are dependencies.

6. **Search Functionality**: Test subject search with various queries (title, description, teacher name).

7. **Error Handling**: Test with invalid data, network errors, and API errors to ensure proper error messages are displayed.

8. **Loading States**: Verify loading states appear correctly during data fetching and form submission.

## 16. Common Patterns & Best Practices

### Data Fetching Pattern

```typescript
const loadData = useCallback(async () => {
  if (!teacherId) {
    return;
  }

  setIsDataLoading(true);
  try {
    const [classesResponse, subjectsResponse] = await Promise.all([
      classService.getAllClasses(),
      subjectService.getAllSubjects(),
    ]);

    setClasses(classesResponse);
    setSubjects(subjectsResponse);
  } catch (error) {
    toast.error(getErrorMessage(error));
  } finally {
    setIsDataLoading(false);
  }
}, [teacherId]);

useEffect(() => {
  if (teacherId) {
    void loadData();
  }
}, [teacherId, loadData]);
```

### Submit Handler Pattern

```typescript
const handleCreateSubmit = useCallback(
  async (values: FormValues) => {
    setIsCreateSubmitting(true);
    try {
      await service.createEntity({
        ...values,
        // Transform values if needed (e.g., dates to ISO strings)
      });
      toast.success("Entity has been created.");
      setIsCreateOpen(false);
      await loadData(); // Refresh data
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsCreateSubmitting(false);
    }
  },
  [loadData]
);
```

### Detail Fetching Pattern

```typescript
const fetchEntityDetail = useCallback(async (entity: EntityDto) => {
  try {
    const detail = await service.getEntityById(entity.id);
    return detail;
  } catch (error) {
    toast.error(getErrorMessage(error));
    return null;
  }
}, []);

const handleViewRequest = useCallback(
  async (entity: EntityDto) => {
    setIsViewOpen(true);
    setIsViewingDetails(true);
    const detail = await fetchEntityDetail(entity);
    if (detail) {
      setViewingEntity(detail);
    } else {
      setIsViewOpen(false);
    }
    setIsViewingDetails(false);
  },
  [fetchEntityDetail]
);
```

## 17. Extending the Integration

### Adding New Fields

1. Update TypeScript types in `types/class.ts` or `types/subject.ts`
2. Update form schema validation in the form dialog component
3. Update form fields in the dialog JSX
4. Update display components (table columns, card content, detail dialog)

### Adding New Relationships

1. Update DTO types to include related data
2. Update service methods if API endpoints change
3. Update detail dialogs to display related data
4. Consider adding navigation between related entities

### Adding Server Components

- Services can be imported directly in Server Components
- For authentication, use Next.js `cookies()` API or server-side token validation
- Consider data fetching patterns for Server Components vs Client Components

## 18. Known Limitations

1. **Hard Delete**: Delete operations are hard deletes. Backend validation prevents deletion if there are dependencies (e.g., deleting a subject with classes).

2. **No Soft Delete**: Currently no soft delete or archive functionality.

3. **No Bulk Operations**: No bulk create, update, or delete operations.

4. **Client-Side Filtering**: Classes and subjects are filtered client-side by `teacherId`. Consider server-side filtering for better performance with large datasets.

5. **No Pagination for Subjects**: Subjects are loaded all at once. Consider adding pagination for teachers with many subjects.

## 19. Troubleshooting

### Teacher ID Not Resolving

- Check that user is authenticated via `useAuth()` hook
- Verify user has `teacherId` in their profile data
- Check `hooks/use-teacher-identity.ts` for localStorage persistence logic

### Classes Not Showing

- Verify classes are filtered by `teacherId` correctly
- Check that `loadData()` is called after `teacherId` is resolved
- Verify API response includes `teacherId` field

### Form Validation Errors

- Check Zod schema matches API requirements
- Verify date formats are converted to ISO strings before submission
- Ensure required fields are marked in schema

### Delete Failures

- Check backend validation—may prevent deletion if dependencies exist
- Verify error messages are displayed correctly
- Check API response format matches error extraction logic

