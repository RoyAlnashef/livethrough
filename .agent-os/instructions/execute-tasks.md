---
description: Task Execution Rules for Agent OS
globs:
alwaysApply: false
version: 1.0
encoding: UTF-8
---

# Task Execution Rules

<ai_meta>
  <parsing_rules>
    - Process XML blocks first for structured data
    - Execute instructions in sequential order
    - Use templates as exact patterns
    - Request missing data rather than assuming
  </parsing_rules>
  <file_conventions>
    - encoding: UTF-8
    - line_endings: LF
    - indent: 2 spaces
    - markdown_headers: no indentation
  </file_conventions>
</ai_meta>

## Overview

<purpose>
  - Execute spec tasks systematically including third-party service setup
  - Follow TDD development workflow
  - Ensure quality through testing and review
  - Handle comprehensive development lifecycle tasks
</purpose>

<context>
  - Part of Agent OS framework
  - Executed after spec planning is complete
  - Follows tasks defined in spec tasks.md
  - Includes supplementary workflow tasks beyond code implementation
</context>

<prerequisites>
  - Spec documentation exists in @.agent-os/specs/
  - Tasks defined in spec's tasks.md
  - Development environment configured
  - Git repository initialized
  - Access to required third-party services (when applicable)
</prerequisites>

<process_flow>

<step number="1" name="task_assignment">

### Step 1: Task Assignment

<step_metadata>
  <inputs>
    - spec_srd_reference: file path
    - specific_tasks: array[string] (optional)
    - task_category: string (optional) - e.g., "Third-Party Service Setup", "Environment Configuration"
  </inputs>
  <default>next uncompleted parent task</default>
</step_metadata>

<task_selection>
  <explicit>user specifies exact task(s) or category</explicit>
  <implicit>find next uncompleted task in tasks.md</implicit>
  <category_based>user specifies task category to focus on</category_based>
</task_selection>

<instructions>
  ACTION: Identify task(s) to execute
  DEFAULT: Select next uncompleted parent task if not specified
  SUPPORT: Task category selection for focused execution
  CONFIRM: Task selection with user
</instructions>

</step>

<step number="2" name="context_analysis">

### Step 2: Context Analysis

<step_metadata>
  <reads>
    - spec SRD file
    - spec tasks.md
    - all files in spec sub-specs/ folder
    - @.agent-os/product/mission.md
  </reads>
  <purpose>complete understanding of requirements and dependencies</purpose>
</step_metadata>

<context_gathering>
  <spec_level>
    - requirements from SRD
    - technical specs
    - test specifications
    - third-party service requirements
    - environment setup needs
  </spec_level>
  <product_level>
    - overall mission alignment
    - technical standards
    - best practices
    - security requirements
  </product_level>
</context_gathering>

<instructions>
  ACTION: Read all spec documentation thoroughly
  ANALYZE: Requirements and specifications for current task
  UNDERSTAND: How task fits into overall spec goals
  IDENTIFY: Dependencies and prerequisites for task execution
</instructions>

</step>

<step number="3" name="task_type_assessment">

### Step 3: Task Type Assessment

<step_metadata>
  <categorizes>task type for appropriate execution approach</categorizes>
  <determines>execution strategy and tools needed</determines>
</step_metadata>

<task_categories>
  <third_party_setup>
    - Service registration and configuration
    - API key generation and management
    - Webhook setup and testing
    - Billing and payment configuration
  </third_party_setup>
  <environment_config>
    - Development environment setup
    - Staging environment provisioning
    - Production environment configuration
    - CI/CD pipeline setup
  </environment_config>
  <code_implementation>
    - Feature development
    - Bug fixes
    - Performance optimization
    - Security implementation
  </code_implementation>
  <testing_validation>
    - Unit test creation
    - Integration testing
    - Performance testing
    - Security testing
  </testing_validation>
  <documentation>
    - Technical documentation
    - User guides
    - API documentation
    - Deployment guides
  </documentation>
  <deployment>
    - Pre-launch testing
    - Production deployment
    - Monitoring setup
    - Launch activities
  </deployment>
</task_categories>

<instructions>
  ACTION: Categorize current task type
  DETERMINE: Appropriate execution approach
  PREPARE: Required tools and resources
  ADAPT: Execution strategy based on task category
</instructions>

</step>

<step number="4" name="implementation_planning">

### Step 4: Implementation Planning

<step_metadata>
  <creates>execution plan tailored to task type</creates>
  <requires>user approval</requires>
</step_metadata>

<plan_structure>
  <format>numbered list with sub-bullets</format>
  <includes>
    - all subtasks from tasks.md
    - implementation approach specific to task type
    - dependencies to install or configure
    - test strategy (if applicable)
    - third-party service requirements (if applicable)
    - environment setup needs (if applicable)
  </includes>
</plan_structure>

<plan_templates>
  <third_party_setup>
    ## Implementation Plan for [SERVICE_NAME] Setup

    1. **[SERVICE_REGISTRATION]**
       - [ ] Create account on [SERVICE_NAME]
       - [ ] Verify email and complete onboarding
       - [ ] Generate API keys and access tokens
       - [ ] Configure service settings

    2. **[INTEGRATION_SETUP]**
       - [ ] Review API documentation
       - [ ] Test API endpoints
       - [ ] Implement authentication
       - [ ] Set up webhooks (if needed)

    **Required Information:**
    - [SERVICE_NAME] account credentials
    - API documentation URL
    - Webhook endpoint requirements

    **Test Strategy:**
    - Test with sandbox/test environment
    - Verify API connectivity
    - Validate webhook functionality
  </third_party_setup>

  <environment_config>
    ## Implementation Plan for [ENVIRONMENT] Setup

    1. **[INFRASTRUCTURE_PROVISIONING]**
       - [ ] Provision required resources
       - [ ] Configure networking and security
       - [ ] Set up monitoring and logging

    2. **[APPLICATION_CONFIGURATION]**
       - [ ] Configure environment variables
       - [ ] Set up databases and storage
       - [ ] Configure CI/CD pipelines

    **Required Resources:**
    - Cloud provider access
    - Domain names and SSL certificates
    - Database credentials

    **Validation Strategy:**
    - Verify all services are accessible
    - Test deployment pipeline
    - Validate monitoring and alerting
  </environment_config>

  <code_implementation>
    ## Implementation Plan for [FEATURE_NAME]

    1. **[DEVELOPMENT_SETUP]**
       - [ ] Install required dependencies
       - [ ] Set up development environment
       - [ ] Configure local testing

    2. **[FEATURE_IMPLEMENTATION]**
       - [ ] Implement core functionality
       - [ ] Add error handling and validation
       - [ ] Write comprehensive tests

    **Dependencies to Install:**
    - [LIBRARY_NAME] - [PURPOSE]

    **Test Strategy:**
    - [TEST_APPROACH]
  </code_implementation>
</plan_templates>

<approval_request>
  I've prepared the above implementation plan for [TASK_TYPE].
  Please review and confirm before I proceed with execution.
</approval_request>

<instructions>
  ACTION: Create detailed execution plan based on task type
  DISPLAY: Plan to user for review
  WAIT: For explicit approval before proceeding
  BLOCK: Do not proceed without affirmative permission
</instructions>

</step>

<step number="5" name="prerequisites_check">

### Step 5: Prerequisites Check

<step_metadata>
  <checks>all prerequisites for task execution</checks>
  <ensures>successful task completion</ensures>
</step_metadata>

<prerequisites_by_type>
  <third_party_setup>
    - Service account access
    - API documentation availability
    - Billing information (if required)
    - Domain verification (if required)
  </third_party_setup>
  <environment_config>
    - Cloud provider access
    - Domain ownership verification
    - SSL certificate availability
    - Database credentials
  </environment_config>
  <code_implementation>
    - Development server status
    - Git branch management
    - Required dependencies
    - Test environment setup
  </code_implementation>
</prerequisites_by_type>

<missing_prerequisites>
  <action>request user to provide missing information</action>
  <format>clear list of what's needed</format>
  <block>execution until prerequisites are met</block>
</missing_prerequisites>

<instructions>
  ACTION: Check all prerequisites for current task type
  IDENTIFY: Missing requirements
  REQUEST: User provide missing information
  BLOCK: Execution until all prerequisites are met
</instructions>

</step>

<step number="6" name="development_server_check">

### Step 6: Development Server Check (Code Tasks Only)

<step_metadata>
  <checks>running development server</checks>
  <prevents>port conflicts</prevents>
  <applies>only to code implementation tasks</applies>
</step_metadata>

<server_check_flow>
  <if_running>
    ASK user to shut down
    WAIT for response
  </if_running>
  <if_not_running>
    PROCEED immediately
  </if_not_running>
</server_check_flow>

<user_prompt>
  A development server is currently running.
  Should I shut it down before proceeding? (yes/no)
</user_prompt>

<instructions>
  ACTION: Check for running local development server (code tasks only)
  CONDITIONAL: Ask permission only if server is running
  PROCEED: Immediately if no server detected
  SKIP: For non-code tasks (third-party setup, environment config, etc.)
</instructions>

</step>

<step number="7" name="git_branch_management">

### Step 7: Git Branch Management (Code Tasks Only)

<step_metadata>
  <manages>git branches</manages>
  <ensures>proper isolation</ensures>
  <applies>only to code implementation tasks</applies>
</step_metadata>

<branch_naming>
  <source>spec folder name</source>
  <format>exclude date prefix</format>
  <example>
    - folder: 2025-03-15-password-reset
    - branch: password-reset
  </example>
</branch_naming>

<branch_logic>
  <case_a>
    <condition>current branch matches spec name</condition>
    <action>PROCEED immediately</action>
  </case_a>
  <case_b>
    <condition>current branch is main/staging/review</condition>
    <action>CREATE new branch and PROCEED</action>
  </case_b>
  <case_c>
    <condition>current branch is different feature</condition>
    <action>ASK permission to create new branch</action>
  </case_c>
</branch_logic>

<case_c_prompt>
  Current branch: [CURRENT_BRANCH]
  This spec needs branch: [SPEC_BRANCH]

  May I create a new branch for this spec? (yes/no)
</case_c_prompt>

<instructions>
  ACTION: Check current git branch (code tasks only)
  EVALUATE: Which case applies
  EXECUTE: Appropriate branch action
  WAIT: Only for case C approval
  SKIP: For non-code tasks
</instructions>

</step>

<step number="8" name="task_execution">

### Step 8: Task Execution

<step_metadata>
  <follows>approved implementation plan</follows>
  <adheres_to>all spec standards</adheres_to>
  <adapts>execution approach based on task type</adapts>
</step_metadata>

<execution_standards>
  <follow_exactly>
    - approved implementation plan
    - spec specifications
    - @.agent-os/product/code-style.md
    - @.agent-os/product/dev-best-practices.md
  </follow_exactly>
  <approach>varies by task type</approach>
</execution_standards>

<execution_by_type>
  <third_party_setup>
    - Follow service-specific setup procedures
    - Document all credentials and settings
    - Test integration thoroughly
    - Validate webhook functionality
  </third_party_setup>
  <environment_config>
    - Follow infrastructure-as-code principles
    - Document all configuration changes
    - Test environment connectivity
    - Validate monitoring and alerting
  </environment_config>
  <code_implementation>
    - Follow test-driven development (TDD)
    - Write failing tests first
    - Implement minimal code to pass
    - Refactor while keeping tests green
  </code_implementation>
  <testing_validation>
    - Create comprehensive test suites
    - Test edge cases and error conditions
    - Validate performance requirements
    - Security testing and validation
  </testing_validation>
  <documentation>
    - Follow documentation standards
    - Include code examples
    - Provide step-by-step instructions
    - Update related documentation
  </documentation>
  <deployment>
    - Follow deployment checklist
    - Monitor system health
    - Validate all functionality
    - Document deployment results
  </deployment>
</execution_by_type>

<instructions>
  ACTION: Execute task based on approved plan and task type
  FOLLOW: All relevant standards and specifications
  ADAPT: Execution approach to task category
  MAINTAIN: Quality and documentation throughout
</instructions>

</step>

<step number="9" name="task_status_updates">

### Step 9: Task Status Updates

<step_metadata>
  <updates>tasks.md file</updates>
  <timing>immediately after completion</timing>
</step_metadata>

<update_format>
  <completed>- [x] Task description</completed>
  <incomplete>- [ ] Task description</incomplete>
  <blocked>
    - [ ] Task description
    ⚠️ Blocking issue: [DESCRIPTION]
  </blocked>
  <requires_user_action>
    - [ ] Task description
    🔄 Requires user action: [DESCRIPTION]
  </requires_user_action>
</update_format>

<blocking_criteria>
  <attempts>maximum 3 different approaches</attempts>
  <action>document blocking issue</action>
  <emoji>⚠️</emoji>
</blocking_criteria>

<user_action_criteria>
  <third_party_setup>requires user credentials or approval</third_party_setup>
  <environment_config>requires user access or domain verification</environment_config>
  <deployment>requires user approval for production changes</deployment>
  <emoji>🔄</emoji>
</user_action_criteria>

<instructions>
  ACTION: Update tasks.md after each task completion
  MARK: [x] for completed items immediately
  DOCUMENT: Blocking issues with ⚠️ emoji
  DOCUMENT: User action requirements with 🔄 emoji
  LIMIT: 3 attempts before marking as blocked
</instructions>

</step>

<step number="10" name="validation_and_testing">

### Step 10: Validation and Testing

<step_metadata>
  <validates>task completion</validates>
  <ensures>quality and functionality</ensures>
  <varies>by task type</varies>
</step_metadata>

<validation_by_type>
  <third_party_setup>
    - Test API connectivity
    - Verify webhook functionality
    - Validate authentication
    - Check rate limiting
  </third_party_setup>
  <environment_config>
    - Test service connectivity
    - Validate configuration
    - Check monitoring and alerting
    - Verify backup systems
  </environment_config>
  <code_implementation>
    - Run unit tests
    - Run integration tests
    - Check code quality
    - Validate functionality
  </code_implementation>
  <testing_validation>
    - Verify test coverage
    - Run performance tests
    - Security validation
    - Cross-browser testing
  </testing_validation>
  <documentation>
    - Review documentation quality
    - Test instructions
    - Validate links and references
    - Check formatting
  </documentation>
  <deployment>
    - Verify deployment success
    - Test all functionality
    - Monitor system health
    - Validate user experience
  </deployment>
</validation_by_type>

<instructions>
  ACTION: Validate task completion based on task type
  TEST: All relevant functionality
  VERIFY: Quality and performance requirements
  DOCUMENT: Any issues or improvements needed
</instructions>

</step>

<step number="11" name="test_suite_verification">

### Step 11: Run All Tests (Code Tasks Only)

<step_metadata>
  <runs>entire test suite</runs>
  <ensures>no regressions</ensures>
  <applies>only to code implementation tasks</applies>
</step_metadata>

<test_execution>
  <order>
    1. Verify new tests pass
    2. Run entire test suite
    3. Fix any failures
  </order>
  <requirement>100% pass rate</requirement>
</test_execution>

<failure_handling>
  <action>troubleshoot and fix</action>
  <priority>before proceeding</priority>
</failure_handling>

<instructions>
  ACTION: Run complete test suite (code tasks only)
  VERIFY: All tests pass including new ones
  FIX: Any test failures before continuing
  BLOCK: Do not proceed with failing tests
  SKIP: For non-code tasks
</instructions>

</step>

<step number="12" name="git_workflow">

### Step 12: Git Workflow (Code Tasks Only)

<step_metadata>
  <creates>
    - git commit
    - github push (user-prompted only)
    - pull request (user-prompted only)
  </creates>
  <applies>only to code implementation tasks</applies>
</step_metadata>

<commit_process>
  <commit>
    <message>descriptive summary of changes</message>
    <format>conventional commits if applicable</format>
  </commit>
  <push>
    <target>spec branch</target>
    <remote>origin</remote>
    <trigger>only when user explicitly commands</trigger>
  </push>
  <pull_request>
    <title>descriptive PR title</title>
    <description>functionality recap</description>
    <trigger>only when user explicitly commands</trigger>
  </pull_request>
</commit_process>

<user_prompt_flow>
  <after_commit>
    STATE: "Changes have been committed locally"
    ASK: "Would you like me to push to GitHub and create a pull request? (yes/no)"
    WAIT: For explicit user confirmation
  </after_commit>
  <if_approved>
    PUSH: To GitHub on dev branch
    CREATE: Pull request with detailed description
  </if_approved>
  <if_declined>
    STATE: "Changes remain committed locally. You can push manually when ready."
    PROCEED: To next step without GitHub operations
  </if_declined>
</user_prompt_flow>

<pr_template>
  ## Summary

  [BRIEF_DESCRIPTION_OF_CHANGES]

  ## Changes Made

  - [CHANGE_1]
  - [CHANGE_2]

  ## Testing

  - [TEST_COVERAGE]
  - All tests passing ✓
</pr_template>

<instructions>
  ACTION: Commit all changes with descriptive message (code tasks only)
  PROMPT: Ask user if they want to push to GitHub
  PUSH: Only when user explicitly confirms
  CREATE: Pull request only when user explicitly confirms
  WAIT: For user decision before any GitHub operations
  SKIP: For non-code tasks
</instructions>

</step>

<step number="13" name="roadmap_progress_check">

### Step 13: Roadmap Progress Check

<step_metadata>
  <checks>@.agent-os/product/roadmap.md</checks>
  <updates>if spec completes roadmap item</updates>
</step_metadata>

<roadmap_criteria>
  <update_when>
    - spec fully implements roadmap feature
    - all related tasks completed
    - tests passing
    - third-party services configured
    - environments properly set up
  </update_when>
  <caution>only mark complete if absolutely certain</caution>
</roadmap_criteria>

<instructions>
  ACTION: Review roadmap.md for related items
  EVALUATE: If current spec completes roadmap goals
  UPDATE: Mark roadmap items complete if applicable
  VERIFY: Certainty before marking complete
</instructions>

</step>

<step number="14" name="completion_notification">

### Step 14: Task Completion Notification

<step_metadata>
  <plays>system sound</plays>
  <alerts>user of completion</alerts>
</step_metadata>

<notification_command>
  afplay /System/Library/Sounds/Glass.aiff
</notification_command>

<instructions>
  ACTION: Play completion sound
  PURPOSE: Alert user that task is complete
</instructions>

</step>

<step number="15" name="completion_summary">

### Step 15: Completion Summary

<step_metadata>
  <creates>summary message</creates>
  <format>structured with emojis</format>
  <adapts>content based on task type</adapts>
</step_metadata>

<summary_template>
  ## ✅ What's been done

  1. **[FEATURE_1]** - [ONE_SENTENCE_DESCRIPTION]
  2. **[FEATURE_2]** - [ONE_SENTENCE_DESCRIPTION]

  ## 🔧 Configuration Changes

  [ONLY_IF_APPLICABLE]
  - **[SERVICE_NAME]** - [CONFIGURATION_DETAILS]
  - **[ENVIRONMENT]** - [SETUP_DETAILS]

  ## ⚠️ Issues encountered

  [ONLY_IF_APPLICABLE]
  - **[ISSUE_1]** - [DESCRIPTION_AND_REASON]

  ## 🔄 Requires user action

  [ONLY_IF_APPLICABLE]
  - **[ACTION_1]** - [DESCRIPTION_AND_REASON]

  ## 👀 Ready to test in browser

  [ONLY_IF_APPLICABLE]
  1. [STEP_1_TO_TEST]
  2. [STEP_2_TO_TEST]

  ## 📦 Pull Request

  [ONLY_IF_APPLICABLE]
  View PR: [GITHUB_PR_URL]

  ## 🔗 Third-Party Services

  [ONLY_IF_APPLICABLE]
  - **[SERVICE_NAME]** - [STATUS_AND_NEXT_STEPS]
</summary_template>

<summary_sections>
  <required>
    - functionality recap
    - configuration changes (if applicable)
  </required>
  <conditional>
    - issues encountered (if any)
    - user action requirements (if any)
    - testing instructions (if testable in browser)
    - pull request info (if code changes)
    - third-party service status (if applicable)
  </conditional>
</summary_sections>

<instructions>
  ACTION: Create comprehensive summary based on task type
  INCLUDE: All required sections
  ADD: Conditional sections if applicable
  FORMAT: Use emoji headers for scannability
  ADAPT: Content to match task category
</instructions>

</step>

</process_flow>

## Development Standards

<standards>
  <code_style>
    <follow>@.agent-os/product/code-style.md</follow>
    <enforce>strictly</enforce>
  </code_style>
  <best_practices>
    <follow>@.agent-os/product/dev-best-practices.md</follow>
    <apply>all directives</apply>
  </best_practices>
  <testing>
    <coverage>comprehensive</coverage>
    <approach>test-driven development</approach>
  </testing>
  <documentation>
    <commits>clear and descriptive</commits>
    <pull_requests>detailed descriptions</pull_requests>
  </documentation>
  <security>
    <credentials>secure storage and handling</credentials>
    <api_keys>environment variable storage</api_keys>
    <access_control>proper authentication and authorization</access_control>
  </security>
</standards>

## Error Handling

<error_protocols>
  <blocking_issues>
    - document in tasks.md
    - mark with ⚠️ emoji
    - include in summary
  </blocking_issues>
  <user_action_required>
    - document in tasks.md
    - mark with 🔄 emoji
    - provide clear instructions
  </user_action_required>
  <test_failures>
    - fix before proceeding
    - never commit broken tests
  </test_failures>
  <technical_roadblocks>
    - attempt 3 approaches
    - document if unresolved
    - seek user input
  </technical_roadblocks>
  <third_party_issues>
    - document service-specific problems
    - provide alternative solutions
    - contact service support if needed
  </third_party_issues>
</error_protocols>

<final_checklist>
  <verify>
    - [ ] Task implementation complete
    - [ ] All tests passing (if applicable)
    - [ ] tasks.md updated
    - [ ] Code committed and pushed (if applicable)
    - [ ] Pull request created (if applicable)
    - [ ] Third-party services configured (if applicable)
    - [ ] Environment setup complete (if applicable)
    - [ ] Roadmap checked/updated
    - [ ] Summary provided to user
  </verify>
</final_checklist>
