"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
	storyList = await StoryList.getStories();
	$storiesLoadingMsg.remove();
	putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, myStories = null) {
	// console.debug("generateStoryMarkup", story);
	let favStatus;
	let star = "";
	let trashCan = "";
	const hostName = story.getHostName();
	if (currentUser) {
		favStatus = currentUser.favorites.some(
			(fav) => fav.storyId === story.storyId
		)
			? "fas"
			: "far";
		star = `<span class="favorite"><i class="${favStatus} fa-star"></i></span>`;
		if (myStories) {
			trashCan = '<span class="delete"><i class="fas fa-trash-alt"></i></span>';
		}
	}

	return $(`
      <li id="${story.storyId}">
        ${trashCan}  
        ${star}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage(fav = null) {
	console.debug("putStoriesOnPage");

	let storyContainer;
	let stories;
	// loop through all of the users favorite stories and generate HTML for them
	if (fav) {
		storyContainer = $favStoriesList;
		stories = currentUser.favorites;
		if (stories.length === 0) {
			storyContainer.html($("<h5>", { text: "No favorites added!" }));
			storyContainer.show();
			return;
		}
	} else {
		storyContainer = $allStoriesList;
		stories = storyList.stories;
	}
	storyContainer.empty();
	for (let story of stories) {
		const $story = generateStoryMarkup(story);
		storyContainer.append($story);
	}
	storyContainer.show();
}

async function submitStory(evt) {
	evt.preventDefault();
	$submitForm.slideUp("slow");
	const author = $authorInput.val();
	const title = $titleInput.val();
	const url = $urlInput.val();
	$submitForm[0].reset();
	const newStory = await storyList.addStory(currentUser, {
		title,
		author,
		url,
	});
	const $story = generateStoryMarkup(newStory);
	$allStoriesList.prepend($story);
}

$submitForm.on("submit", submitStory);

async function addOrRemoveFav(evt) {
	if (
		(evt.target.tagName === "SPAN" && evt.target.className === "favorite") ||
		(evt.target.tagName === "I" &&
			evt.target.parentElement.className === "favorite")
	) {
		const list = evt.target.closest("li");
		let star = evt.target.closest("i");
		let story = storyList.stories.find((s) => s.storyId === list.id);
		if (currentUser.favorites.some((fav) => fav.storyId === list.id)) {
			await currentUser.removeFavorite(story);
		} else {
			await currentUser.addFavorite(story);
		}
		star.classList.toggle("far");
		star.classList.toggle("fas");
	}
}

$(".stories-container").on("click", addOrRemoveFav);

async function deleteStory(evt) {
	if (
		(evt.target.tagName === "SPAN" && evt.target.className === "delete") ||
		(evt.target.tagName === "I" &&
			evt.target.parentElement.className === "delete")
	) {
		const list = evt.target.closest("li");
		let story = storyList.stories.find((s) => s.storyId === list.id);
		await storyList.removeStory(currentUser, story);
		hidePageComponents();
		putMyStoriesOnPage();
	}
}

$myStoriesList.on("click", deleteStory);

function putMyStoriesOnPage() {
	console.debug("putMyStoriesOnPage");

	$myStoriesList.empty();
	const stories = currentUser.ownStories;
	if (stories.length === 0) {
		$myStoriesList.html($("<h5>", { text: "No stories added by user yet!" }));
		$myStoriesList.show();
		return;
	}
	// loop through all of the user's submitted stories and generate HTML for them
	for (let story of stories) {
		const $story = generateStoryMarkup(story, true);
		$myStoriesList.append($story);
	}
	$myStoriesList.show();
}
