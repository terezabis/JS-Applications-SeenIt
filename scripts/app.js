$(() => {
    showView('viewWelcome');

    (() => {
        $('.content').find('a[data-target]').click(navigateTo);
        $('#registerForm').submit(registerUser);
        $('#loginForm').submit(loginUser);
        $('a[href="#/logout"]').click(logoutUser);

        $('a[data-target="Catalog"]').click(loadAllPosts);
        $('a[data-target="MyPosts"]').click(loadMyPosts);


        $('.notification').click(function() {
            $(this).hide();
        });

        $('.action')
    })()

    if(sessionStorage.getItem('authtoken') === null){
        userLoggedOut();
    } else {
        userLoggedIn();
    }

    function deleteMyPost() {
        let postId = $(this).val();

        postssService.deletePost(postId)
            .then(() => {
                showInfo('Message deleted.');
                loadMyPosts();
            }).catch(handleError);
    }

    function deletePost() {
        let postId = $(this).val();

        postssService.deletePost(postId)
            .then(() => {
                showInfo('Message deleted.');
                loadAllPosts();
            }).catch(handleError);
    }


    function loadAllPosts() {
        let username = sessionStorage.getItem('username');
        postssService.loadPosts()
            .then((myMessages) => {
                displayAllMessages(myMessages);
            }).catch(handleError);
    }

    function displayAllMessages(myMessages) {
        let postsContainer = $('#viewCatalog');
        postsContainer.empty();
        let postsDiv = $('<div>').addClass("posts");

        if(myMessages.length===0){
            let noItem = $('<span>').addClass("post").text("No posts in database.");
            noItem.appendTo(postsDiv);
        } else {

            let count = 1;

            for (let msg of myMessages) {
                let article = $('<article>').addClass("post");
                let rankDiV = $('<div>').addClass("col rank");
                rankDiV.append($('<span>').text(Number(count)));
                let colDiv = $('<div>').addClass("col thumbnail");
                let aLink = $('<a>', {href: msg['url']});
                let img = $('<img>').attr('src', msg['imageUrl']);
                aLink.append(img);
                colDiv.append(aLink);
                let postDiv = $('<div>').addClass("post-content");
                let titleDiv = $('<div>').addClass("title");
                let aLink2 = $('<a>', {
                    href: msg['url'],
                    text: msg['title']
                });
                aLink2.appendTo(titleDiv);
                let detailsDiv = $('<div>').addClass("details");
                let infoDiv = $('<div>').addClass("info");
                infoDiv.text(`Submited ${calcTime(msg['_kmd']['lmt'])} ago by ${msg["author"]}`);
                infoDiv.appendTo(detailsDiv);
                let controlsDiv = $('<div>').addClass("controls");
                let ul = $('<ul>');
                let liComments = $('<li>').addClass("action");
                let aComment = $('<a>', {href: "#"}).addClass("commentsLink");
                aComment.text("comments");
                let liEdit = $('<li>').addClass("action");
                let aEdit = $('<a>', {href: "#"}).addClass("editLink");
                aEdit.text("edit");
                let liDelete = $('<li>').addClass("action");
                let aDelete = $('<a>', {href: "#"}).addClass("deleteLink");
                aDelete.text("delete");
                aDelete.attr('value', msg._id);
                aDelete.click(deletePost);

                aComment.appendTo(liComments);
                liComments.appendTo(ul);
                liEdit.appendTo(ul);
                aEdit.appendTo(liEdit);
                liDelete.appendTo(ul);
                aDelete.appendTo(liDelete);

                ul.appendTo(controlsDiv);
                controlsDiv.appendTo(detailsDiv);

                titleDiv.appendTo(postDiv);
                detailsDiv.appendTo(postDiv);

                article.append(rankDiV);
                article.append(colDiv);
                article.append(postDiv);
                postsDiv.append(article);
                count++;
            }
        }
        postsContainer.append(postsDiv);
    }

    function loadMyPosts() {
        let username = sessionStorage.getItem('username');
        postssService.loadMyPosts(username)
            .then((myMessages) => {
                displayMyMessages(myMessages);
            }).catch(handleError);
    }

    function displayMyMessages(myMessages) {
        let postsContainer = $('#viewMyPosts');
        postsContainer.empty();
        let div = $('<div>').addClass("post post-content");
        let h1 = $('<h1>').text("Your Posts");
        h1.appendTo(div);
        div.appendTo(postsContainer);
        let postsDiv = $('<div>').addClass("posts");
        if(myMessages.length===0){
            let noItem = $('<span>').addClass("post").text("No posts in database.");
            noItem.appendTo(postsDiv);
        } else {
            let count = 1;

            for (let msg of myMessages) {
                let article = $('<article>').addClass("post");
                let rankDiV = $('<div>').addClass("col rank");
                rankDiV.append($('<span>').text(Number(count)));
                let colDiv = $('<div>').addClass("col thumbnail");
                let aLink = $('<a>', {href: msg['url']});
                let img = $('<img>').attr('src', msg['imageUrl']);
                aLink.append(img);
                colDiv.append(aLink);
                let postDiv = $('<div>').addClass("post-content");
                let titleDiv = $('<div>').addClass("title");
                let aLink2 = $('<a>', {
                    href: msg['url'],
                    text: msg['title']
                });
                aLink2.appendTo(titleDiv);
                let detailsDiv = $('<div>').addClass("details");
                let infoDiv = $('<div>').addClass("info");
                infoDiv.text(`Submited ${calcTime(msg['_kmd']['lmt'])} ago by ${msg["author"]}`);
                infoDiv.appendTo(detailsDiv);
                let controlsDiv = $('<div>').addClass("controls");
                let ul = $('<ul>');
                let liComments = $('<li>').addClass("action");
                let aComment = $('<a>', {href: "#"}).addClass("commentsLink");
                aComment.text("comments");
                let liEdit = $('<li>').addClass("action");
                let aEdit = $('<a>', {href: "#"}).addClass("editLink");
                aEdit.text("edit");
                let liDelete = $('<li>').addClass("action");
                let aDelete = $('<a>', {href: "#"}).addClass("deleteLink");
                aDelete.text("delete");
                aDelete.attr('value', msg._id);
                aDelete.on('click', deleteMyPost);

                aComment.appendTo(liComments);
                liComments.appendTo(ul);
                liEdit.appendTo(ul);
                aEdit.appendTo(liEdit);
                liDelete.appendTo(ul);
                aDelete.appendTo(liDelete);

                ul.appendTo(controlsDiv);
                controlsDiv.appendTo(detailsDiv);

                titleDiv.appendTo(postDiv);
                detailsDiv.appendTo(postDiv);

                article.append(rankDiV);
                article.append(colDiv);
                article.append(postDiv);
                postsDiv.append(article);
                count++;
            }
        }
        postsContainer.append(postsDiv);
    }



    function logoutUser() {
        auth.logout()
            .then(() => {
                sessionStorage.clear();
                showInfo('Logout successful.');
                userLoggedOut();
            }).catch(handleError);
    }

    // LOGIC TO LOGIN USER
    function loginUser(ev) {
        ev.preventDefault();
        let loginForm = $('#loginForm');
        let inputUsername = loginForm.find($('input[name="username"]'));
        let inputPassword = loginForm.find($('input[name="password"]'));

        let usernameVal = inputUsername.val();
        let passwdVal = inputPassword.val();

        if(!/^[a-zA-Z]{3,}$/.test(usernameVal)){
            showError("Invalid username. Username must be at least 3 english alphabetical letters.");
            inputUsername.val("");
            inputPassword.val("");
            return;
        }
        if(!/^[a-zA-Z0-9]{6,}$/.test(passwdVal)){
            showError("Invalid password. Password must be at least 6 english alphabetical letters and digits.");
            inputUsername.val("");
            inputPassword.val("");
            return;
        }

        auth.login(usernameVal, passwdVal)
            .then((userInfo) => {
                saveSession(userInfo);
                inputUsername.val('');
                inputPassword.val('');
                showInfo('Login successful.');
            }).catch(handleError);
    }

    // LOGIC TO REGISTER USER
    function registerUser(ev) {
        ev.preventDefault();
        let registerForm = $('#registerForm');
        let registerUsername = registerForm.find($('input[name="username"]'));
        let registerPassword = registerForm.find($('input[name="password"]'));
        let repeatPassword = registerForm.find($('input[name="repeatPass"]'));

        let usernameVal = registerUsername.val();
        let passVal = registerPassword.val();
        let repeatPassVal = repeatPassword.val();

        if(!/^[a-zA-Z]{3,}$/.test(usernameVal)){
            showError("Invalid username. Username must be at least 3 english alphabetical letters.");
            registerUsername.val("");
            registerPassword.val("");
            repeatPassword.val("");
            return;
        }
        if(!/^[a-zA-Z0-9]{6,}$/.test(passVal)){
            showError("Invalid password. Password must be at least 6 english alphabetical letters and digits.");
            registerUsername.val("");
            registerPassword.val("");
            repeatPassword.val("");
            return;
        }
        if(passVal !== repeatPassVal){
            showError("The passwords don't match.");
            registerUsername.val("");
            registerPassword.val("");
            repeatPassword.val("");
            return;
        }

        auth.register(usernameVal, passVal)
            .then((userInfo) => {
                saveSession(userInfo);
                registerUsername.val("");
                registerPassword.val("");
                repeatPassword.val("");
                showInfo('User registration successful.');
            }).catch(handleError);
    }

    function navigateTo() {
        let viewName = $(this).attr('data-target');
        showView(viewName);
    }

    // Shows one view/section at a time
    function showView(viewName) {
        $('.content > section').hide();
        $('#view' + viewName).show();
    }

    function userLoggedOut() {
        $('#viewWelcome').show();
        $('#profile').hide();
        $('#menu').hide();
        showView('Welcome');
    }

    function userLoggedIn() {
        $('#viewWelcome').hide();
        $('#profile').show();
        $('#menu').show();
        let username = sessionStorage.getItem('username');
        $('#profile span').text(username);
        //showView('Catalog');
        $('#viewCatalog').show();
        loadAllPosts();
    }

    function saveSession(userInfo) {
        let userAuth = userInfo._kmd.authtoken;
        sessionStorage.setItem('authtoken', userAuth);
        let userId = userInfo._id;
        sessionStorage.setItem('userId', userId);
        let username = userInfo.username;
        sessionStorage.setItem('username', username);
        userLoggedIn();
    }

    function handleError(reason) {
        showError(reason.responseJSON.description);
    }

    function showInfo(message) {
        let infoBox = $('#infoBox');
        infoBox.text(message);
        infoBox.show();
        setTimeout(() => infoBox.fadeOut(), 3000);
    }

    function showError(message) {
        let errorBox = $('#errorBox');
        errorBox.text(message);
        errorBox.show();
        setTimeout(() => errorBox.fadeOut(), 3000);
    }

    function calcTime(dateIsoFormat) {
        let diff = new Date - (new Date(dateIsoFormat));
        diff = Math.floor(diff / 60000);
        if (diff < 1) return 'less than a minute';
        if (diff < 60) return diff + ' minute' + pluralize(diff);
        diff = Math.floor(diff / 60);
        if (diff < 24) return diff + ' hour' + pluralize(diff);
        diff = Math.floor(diff / 24);
        if (diff < 30) return diff + ' day' + pluralize(diff);
        diff = Math.floor(diff / 30);
        if (diff < 12) return diff + ' month' + pluralize(diff);
        diff = Math.floor(diff / 12);
        return diff + ' year' + pluralize(diff);
        function pluralize(value) {
            if (value !== 1) return 's';
            else return '';
        }
    }

    $(document).on({
        ajaxStart: () => $("#loadingBox").show(),
        ajaxStop: () => $('#loadingBox').fadeOut()
    });

});