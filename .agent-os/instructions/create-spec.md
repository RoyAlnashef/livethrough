# Create Spec Instructions

## Overview
When creating specifications for new features, follow these guidelines to ensure consistency and proper organization.

## File Location Requirements

**ALWAYS** create spec files in the `.agent-os/specs/` directory following this naming convention:

```
.agent-os/specs/YYYY-MM-DD-feature-name/
└── spec.md
```

### Naming Convention
- **Directory**: Use date format `YYYY-MM-DD` followed by a descriptive feature name
- **File**: Use descriptive name ending in `_SPEC.md` or `SPEC.md`
- **Example**: `2025-01-27-course-detail-seo-optimization/COURSE_DETAIL_SEO_SPEC.md`

### Directory Structure
```
.agent-os/specs/
├── 2025-07-23-course-deletion-error-fix/
├── 2025-07-23-course-photos-folder-deletion-bug/
├── 2025-01-27-course-detail-seo-optimization/
│   └── spec.md
└── [new-spec-directory]/
    └── spec.md
```

## Spec Content Requirements

### Required Sections
1. **Overview** - Brief description of the feature
2. **Current State Analysis** - What exists now
3. **Technical Requirements** - Detailed technical specifications
4. **Implementation Plan** - Phased approach with timelines
5. **Success Metrics** - Measurable outcomes
6. **Testing & Validation** - How to verify success
7. **Risk Mitigation** - Potential issues and solutions

### Code Examples
- Include relevant code snippets
- Show file structure changes
- Provide API endpoint specifications
- Include database schema changes if needed

### Technical Details
- File paths and naming conventions
- Dependencies and packages
- Configuration changes
- Performance considerations

## Process Steps

1. **Create Directory**: `mkdir -p .agent-os/specs/YYYY-MM-DD-feature-name/`
2. **Create Spec File**: Create the specification document in the new directory
3. **Follow Template**: Use the established format and sections
4. **Include Examples**: Provide code examples and technical details
5. **Set Timeline**: Include implementation phases and deadlines

## Examples

### Good Spec Location
```
.agent-os/specs/2025-01-27-course-detail-seo-optimization/spec.md
```

### Bad Spec Location
```
spec.md  # ❌ Root directory
specs/spec.md  # ❌ Wrong folder
```

## Reminder
**NEVER** create spec files in the root directory or outside the `.agent-os/specs/` folder structure. Always follow the established naming convention and directory structure. 