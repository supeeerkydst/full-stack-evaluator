I implemented the following:

1. Login page
    - for users
        - view and mark their tasks done
        - updates on the database
    - default admin
        - i set a default admin only for checking, assigning and viewing of tasks
        - login credentials for admin:
            admin
            12345

2. Assigning of tasks
    - i designed a front-end where registered users (email) will be displayed through
        the select-option element
    - a task title input
    - then assigns the task to the selected user

3. Adding of users
    - adding of users through modal
    - inputs email only, and the application sets a default password instead: default123
        this is just to simulate real applications where sensitive data are no longer provided
        by the administrator

4. Viewing / Updating of tasks
    - only the admin can assign task
    - admin can update a task's status
