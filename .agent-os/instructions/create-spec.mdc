# Create Spec Instructions

## Overview
When creating specifications for new features, follow these guidelines to ensure consistency and proper organization. This includes both technical implementation and supplementary workflow tasks like third-party service setup, environment configuration, and deployment preparation.

## File Location Requirements

**ALWAYS** create spec files in the `.agent-os/specs/` directory following this naming convention:

```
.agent-os/specs/YYYY-MM-DD-feature-name/
├── spec.md
└── tasks.md
```

### Naming Convention
- **Directory**: Use date format `YYYY-MM-DD` followed by a descriptive feature name
- **File**: Use descriptive name ending in `_SPEC.md` or `SPEC.md`
- **Example**: `2025-07-24-course-detail-seo-optimization/COURSE_DETAIL_SEO_SPEC.md`
- **IMPORTANT**: Always use the current date in YYYY-MM-DD format (e.g., `2025-07-24` for July 24, 2025)
- Do not use future dates or incorrect dates

### Directory Structure
```
.agent-os/specs/
├── 2025-07-23-course-deletion-error-fix/
│   ├── spec.md
│   └── tasks.md
├── 2025-07-23-course-photos-folder-deletion-bug/
│   ├── spec.md
│   └── tasks.md
├── 2025-07-23-course-detail-seo-optimization/
│   ├── spec.md
│   └── tasks.md
└── [new-spec-directory]/
    ├── spec.md
    └── tasks.md
```

## Spec Content Requirements

### Required Sections
1. **Overview** - Brief description of the feature and its business value
2. **Current State Analysis** - What exists now and what's missing
3. **Technical Requirements** - Detailed technical specifications
4. **Third-Party Dependencies** - External services, APIs, and tools needed
5. **Environment Setup** - Development, staging, and production requirements
6. **Implementation Plan** - Phased approach with timelines
7. **Success Metrics** - Measurable outcomes and KPIs
8. **Testing & Validation** - How to verify success
9. **Risk Mitigation** - Potential issues and solutions
10. **Deployment Considerations** - Production readiness requirements

### Code Examples
- Include relevant code snippets
- Show file structure changes
- Provide API endpoint specifications
- Include database schema changes if needed
- Configuration file examples

### Technical Details
- File paths and naming conventions
- Dependencies and packages
- Configuration changes
- Performance considerations
- Security requirements

## Tasks.md Requirements

**ALWAYS** create a `tasks.md` file alongside the spec with comprehensive workflow tasks:

### Required Task Categories

#### 1. **Third-Party Service Setup**
- [ ] **Service Registration Tasks**
  - [ ] Sign up for required third-party services
  - [ ] Verify email addresses and complete onboarding
  - [ ] Generate API keys and access tokens
  - [ ] Set up billing and payment methods
  - [ ] Configure service-specific settings

- [ ] **API Integration Tasks**
  - [ ] Review API documentation
  - [ ] Test API endpoints with sample data
  - [ ] Implement authentication methods
  - [ ] Set up webhook endpoints (if required)
  - [ ] Configure rate limiting and error handling

#### 2. **Environment Configuration**
- [ ] **Development Environment**
  - [ ] Install required dependencies
  - [ ] Configure local development tools
  - [ ] Set up environment variables
  - [ ] Configure local databases
  - [ ] Set up debugging tools

- [ ] **Staging Environment**
  - [ ] Provision staging infrastructure
  - [ ] Configure staging environment variables
  - [ ] Set up staging databases
  - [ ] Configure monitoring and logging
  - [ ] Set up CI/CD pipelines

- [ ] **Production Environment**
  - [ ] Provision production infrastructure
  - [ ] Configure production environment variables
  - [ ] Set up production databases
  - [ ] Configure SSL certificates
  - [ ] Set up backup and disaster recovery

#### 3. **Development Workflow**
- [ ] **Code Implementation**
  - [ ] Set up project structure
  - [ ] Implement core functionality
  - [ ] Add error handling and validation
  - [ ] Implement logging and monitoring
  - [ ] Add comprehensive tests

- [ ] **Quality Assurance**
  - [ ] Code review and refactoring
  - [ ] Performance optimization
  - [ ] Security audit
  - [ ] Accessibility testing
  - [ ] Cross-browser compatibility testing

#### 4. **Documentation and Training**
- [ ] **Technical Documentation**
  - [ ] Update API documentation
  - [ ] Create deployment guides
  - [ ] Document configuration procedures
  - [ ] Create troubleshooting guides
  - [ ] Update README files

- [ ] **User Documentation**
  - [ ] Create user guides
  - [ ] Write feature announcements
  - [ ] Create training materials
  - [ ] Update help documentation
  - [ ] Create video tutorials

#### 5. **Deployment and Launch**
- [ ] **Pre-Launch Checklist**
  - [ ] Final testing in staging environment
  - [ ] Performance testing under load
  - [ ] Security penetration testing
  - [ ] Backup verification
  - [ ] Rollback plan preparation

- [ ] **Launch Activities**
  - [ ] Deploy to production
  - [ ] Monitor system health
  - [ ] Verify all functionality
  - [ ] Send launch notifications
  - [ ] Monitor user feedback

#### 6. **Post-Launch Activities**
- [ ] **Monitoring and Maintenance**
  - [ ] Monitor system performance
  - [ ] Track error rates and logs
  - [ ] Monitor user engagement metrics
  - [ ] Schedule regular maintenance
  - [ ] Plan future improvements

### Task Format
```markdown
## [CATEGORY_NAME]

### [SUB_CATEGORY]

- [ ] **Task Title** - Brief description
  - [ ] Subtask 1
  - [ ] Subtask 2
  - [ ] Subtask 3

- [ ] **Another Task** - Brief description
  - [ ] Subtask 1
  - [ ] Subtask 2
```

## Process Steps

1. **Create Directory**: `mkdir -p .agent-os/specs/YYYY-MM-DD-feature-name/`
   - **CRITICAL**: Use the current date in YYYY-MM-DD format
   - Do not use future dates or incorrect dates

2. **Create Spec File**: Create the specification document in the new directory
   - Follow the established format and sections
   - Include comprehensive technical details
   - Add third-party service requirements

3. **Create Tasks File**: Create `tasks.md` with all workflow tasks
   - Include all required task categories
   - Break down complex tasks into subtasks
   - Add specific instructions for each task

4. **Review and Refine**: Ensure completeness and accuracy
   - Verify all dependencies are identified
   - Check that tasks cover the full development lifecycle
   - Ensure tasks are actionable and specific

## Examples

### Good Spec Location
```
.agent-os/specs/2025-07-23-course-detail-seo-optimization/
├── spec.md
└── tasks.md
```

### Bad Spec Location
```
spec.md  # ❌ Root directory
specs/spec.md  # ❌ Wrong folder
```

## Third-Party Service Integration Guidelines

### Common Services to Consider
- **Payment Processors**: Stripe, PayPal, Square
- **Authentication**: Auth0, Firebase Auth, Supabase Auth
- **Email Services**: SendGrid, Mailgun, AWS SES
- **File Storage**: AWS S3, Google Cloud Storage, Cloudinary
- **CDN Services**: Cloudflare, AWS CloudFront
- **Monitoring**: Sentry, DataDog, New Relic
- **Analytics**: Google Analytics, Mixpanel, Amplitude
- **Search**: Algolia, Elasticsearch, Typesense
- **Chat/Support**: Intercom, Zendesk, Crisp

### Service Setup Checklist
- [ ] Account creation and verification
- [ ] API key generation and secure storage
- [ ] Webhook configuration
- [ ] Rate limit understanding
- [ ] Error handling strategy
- [ ] Cost monitoring setup
- [ ] Documentation review
- [ ] Testing with sandbox/test environments

## Reminder
**NEVER** create spec files in the root directory or outside the `.agent-os/specs/` folder structure. Always follow the established naming convention and directory structure. **ALWAYS** include comprehensive tasks.md files that cover the full development workflow including third-party service setup and environment configuration. 