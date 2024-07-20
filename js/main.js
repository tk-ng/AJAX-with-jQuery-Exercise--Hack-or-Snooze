"use strict";

// So we don't have to keep re-finding things on page, find DOM elements once:

const $body = $("body");

const $storiesLoadingMsg = $("#stories-loading-msg");
const $allStoriesList = $("#all-stories-list");
const $favStoriesList = $("#fav-stories-list");
const $myStoriesList = $("#my-stories");

const $loginForm = $("#login-form");
const $signupForm = $("#signup-form");
const $submitForm = $("#submit-form");

const $navLogin = $("#nav-login");
const $navUserProfile = $("#nav-user-profile");
const $navLogOut = $("#nav-logout");
const $navSubmit = $("#nav-submit-story");
const $navFavorites = $("#nav-favorites");
const $navMyStories = $("#nav-my-stories");

const $authorInput = $("#story-author");
const $titleInput = $("#story-title");
const $urlInput = $("#story-url");

/** To make it easier for individual components to show just themselves, this
 * is a useful function that hides pretty much everything on the page. After
 * calling this, individual components can re-show just what they want.
 */

function hidePageComponents() {
	const components = [
		$allStoriesList,
		$favStoriesList,
		$myStoriesList,
		$loginForm,
		$signupForm,
		$submitForm,
	];
	components.forEach((c) => c.hide());
}

/** Overall function to kick off the app. */

async function start() {
	console.debug("start");

	// "Remember logged-in user" and log in, if credentials in localStorage
	await checkForRememberedUser();
	await getAndShowStoriesOnStart();

	// if we got a logged-in user
	if (currentUser) updateUIOnUserLogin();
}

// Once the DOM is entirely loaded, begin the app

// async function remove() {
// 	const user = await axios.post(
// 		"https://hack-or-snooze-v3.herokuapp.com/login",
// 		{
// 			user: { username: "newAccUsername", password: "newAccPassword" },
// 		}
// 	);
// 	const { token } = user.data;
// 	await axios.delete(
// 		"https://hack-or-snooze-v3.herokuapp.com/users/newAccUsername",
// 		{ token: token }
// 	);
// }

console.warn(
	"HEY STUDENT: This program sends many debug messages to" +
		" the console. If you don't see the message 'start' below this, you're not" +
		" seeing those helpful debug messages. In your browser console, click on" +
		" menu 'Default Levels' and add Verbose"
);
$(start);
