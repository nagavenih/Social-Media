document.getElementById('postForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent the default form submission
    const content = e.target.content.value; // Get the content of the textarea

    const postId = Date.now().toString();
    const userData = JSON.parse(localStorage.getItem("user"));

    const postData = {
        UserID: userData.UserID,
        PostID: postId,
        PostDetail: content
    };

    try {
        const response = await fetch('http://localhost:3000/posts/AddPost', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(postData),
        });

        if (!response.ok) {
            throw await response.json();
        }

        console.log('Post added successfully:', await response.json());
        
        // Display success message
        const messageDiv = document.querySelector('.error');
        messageDiv.style.color = 'green';
        messageDiv.textContent = `Post "${content}" uploaded successfully!`;
        
        e.target.reset(); // Reset the form
        await loadComments(userData.UserID); // Reload comments after adding a post
    } catch (error) {
        console.error('Error adding post:', error);
        
        // Display error message
        const messageDiv = document.querySelector('.error');
        messageDiv.style.color = 'red';
        messageDiv.textContent = error.message;
    }
});

// Clear the message when the textarea is focused
document.querySelector('textarea[name="content"]').addEventListener('focus', () => {
    const messageDiv = document.querySelector('.error');
    messageDiv.textContent = ''; // Clear the message
});

// Load comments for the specific user
async function loadComments(userId) {
    try {
        const response = await fetch(`http://localhost:3000/posts/GetUserPosts?UserID=${userId}`, {
            method: 'GET',
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) {
            throw await response.json();
        }

        const commentsTableBody = document.querySelector('#commentsTable tbody');
        commentsTableBody.innerHTML = ''; // Clear existing rows

        const comments = await response.json();

        // Check if there are no comments
        const noCommentsMessage = document.getElementById('noCommentsMessage');
        if (comments.length === 0) {
            // Hide the comments table and show the no comments message
            commentsTableBody.closest('table').style.display = 'none';
            noCommentsMessage.style.display = 'block';
        } else {
            // Show the comments table and hide the no comments message
            commentsTableBody.closest('table').style.display = 'table';
            noCommentsMessage.style.display = 'none';

            // Sort comments from latest to least based on CreatedOn
            comments.sort((a, b) => new Date(b.CreatedOn) - new Date(a.CreatedOn));

            comments.forEach(comment => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${comment.PostID}</td>
                    <td>${comment.PostDetail}</td>
                    <td>${new Date(comment.CreatedOn).toLocaleString()}</td>
                `;
                commentsTableBody.appendChild(row);
            });
        }
    } catch (error) {
        console.error('Error loading comments:', error);
    }
}

// Load comments when the page is loaded
document.addEventListener('DOMContentLoaded', () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData && userData.UserID) {
        loadComments(userData.UserID);
    }
});
