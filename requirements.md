# Software Requirements

# Vision

GIFSMS, "Gif2Gif", "Gifs with friends", "Gif'la jiff" strives to be one of the only gif based messaging services.

Gif in standard messaging apps can seem out of place and busy. But Gif can say so much with so little if only your friends would respond in kind!

You'll no longer need to worry about seeing your lone Gif playing over and over without response or acknowledgment. Those chains of gif replies never have to end.

# Scope (In/Out)
### IN

  * The app will allow users to login via authorization services that ties to one of their other accounts.
  * It will notify users of who is on/in room and when they enter and leave.
  * A text box input will retrieve and set of applicable gifs for the user to select from.
  * Multiple rooms will be available for users to select from.
  * "Lucky" button will auto select gif.

### OUT 
  * Do not intend to use SMS
  * Roles/ACL not applicable
  * Not intended to send text

## MVP
A user can login, see a main message board, type a response, be presented with some gif to choose from and their selected reply will be posted to the message board for all to see.

## Stretch Goals
* "lucky button" randomly selects reply gif
* Reaction options, users can added emoji reactions to replies in the message board
* Gif Voting positive and negative vote submissions can remove or "promote" well recieved replies.
* "Last One Standing" message boards will auto kick users that dont respon in sufficient time, or if they use a gif that ahas already been used in the thread. If there post gets down voted and removed they will have to try again before time is up or risk getting booted! last 3 remaining will be identified with a badge on there username.

## Functional Requirments

* Users will login via authorization services that ties to one of their other accounts.
  - Notify users of who is on/in room and when they enter and leave.
  - Text box input will retrieve and set of applicable gifs for the user to select from.
  - Multiple rooms available for users to select from.
  - "Lucky" button will auto select gif.

## Data Flow
* Login
  - O Auth
  - token retrieved and sent with user info
* Splash
  - user hits "splash/home" route and is presented with the main/global chat log.
  - text input box is below message log
* Users text input is sent to Giphy API and results are rendered for selection
  - users mouse click determines selected gif and posts it to message board
  - Lucky button opption auto/randomly selects

## Non-Functional Requirements
Non-functional requirements are requirements that are not directly related to the functionality of the application but still important to the app.


Security
Usability
Testability
- Testing could be difficult as the 
etc….
Pick 2 non-functional requirements and describe their functionality in your application.

If you are stuck on what non-functional requirements are, do a quick online search and do some research. Write a minimum of 3-5 sentences to describe how the non-functional requirements fits into your app.

You MUST describe what the non-functional requirement is and how it will be implemented. Simply saying “Our project will be testable for testibility” is NOT acceptable. Tell us how, why, and what.