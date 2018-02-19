let postssService  = (() => {

    function loadPosts() {
        let endpoint = 'posts?query={}&sort={"_kmd.ect": -1}';

        return requester.get('appdata', endpoint, 'kinvey');
    }

    function loadMyPosts(username) {
        let endpoint = `posts?query={"author":"${username}"}&sort={"_kmd.ect": -1}`;

        return requester.get('appdata', endpoint, 'kinvey');
    }

    function deletePost(postId) {
        let endpoint = `posts/${postId}`;

        return requester.remove('appdata', endpoint, 'kinvey');
    }

    return {
        loadPosts,
        loadMyPosts,
        deletePost
    }

})()