// MUC.js
var pWin = window.opener || window;
var nickname = '', oldnick = '', oldsubject = '';
var aTimeout = 0, maxscroll = 0, currentscroll = 0;

// MSIE does not support indexOf for some reason
// Taken from http://soledadpenades.com/2007/05/17/arrayindexof-in-internet-explorer/
if (!Array.indexOf) {
  Array.prototype.indexOf = function(obj) {
    for (var i = 0; i < this.length; i++) {
      if (this[i] == obj){
        return i;
      }
    }
    return -1;
  };
};

/**
 * @param {Integer} top The current position of the top of the scrollbar
 */
function xcScrollSave(top) {
  if (top > maxscroll) {
    maxscroll = top;
  }
  currentscroll = top;
}


/**
 * Set message information and then activate timeout to clear it
 * @param {String} msg The message to set
 * @param {Boolean} error Determine if the message is an error message or not
 * @param {Boolean} timeout Use timeout or whether it will be manual
 * @action sets the message and calls the timeout to clear it
 */
function xcSetMsg(msg, error, timeout) {
  (error) ? JQ('#msg').addClass('xcError').html(msg) : JQ('#msg').removeClass('xcError').html(msg);
  JQ('#msg').show();
  if (timeout) { aTimeout = setTimeout('xcMsgClear()', pWin.XC.ERRORTIMEOUT); };
};

/**
 * Clears the msg container and removes the error class if it was associated
 */
function xcMsgClear() {
  JQ('#msg').removeClass('xcError').html('');
  JQ('#msg').hide();
  clearTimeout(aTimeout);
};

/**
 * Posts the contents of the MUC chat to the save on the server
 */
function xcPostMUCChat() {
  if (!pWin.XC.srvUrl) { return false; };
  var body = new Array();
  var title = JQ('#subject').val();
  var participants = new Array();
  var tarray = new Array();
  // retrieve the participants in the conversation
  JQ('#muc_occupants.xcMUCOccupants div.xcMUCOccupant').each(function() {
    if (JQ(this).children('div#xcMUCCurrentUser').size() == 0) {
      participants.push(JQ(this).html());
    } else {
      participants.push(JQ(this).find('div#xcMUCCurrentUser strong').html());
    };
  });
  // retrieve the conversation information from the window
  JQ('#msg_pane.xcMUCMsgPane div.xcChatMessage').each(function() {
    var timestamp = JQ(this).find('.xcChatMessageHeader .xcChatMessageTimestamp').html();
    var name = JQ(this).find('.xcChatMessageHeader .xcChatMessageSender').html();
    // if the name was not in the participants list i.e. they have already left then make sure we add it
    if (participants.indexOf(name) == -1) { participants.push(name); };
    if (timestamp) {
      name = name + ' (' + timestamp + '): ';
      tarray.push(timestamp);
    };
    var data = name + JQ(this).children('p.xcChatMessageBody').html();
    body.push(data);
  });
  // check if the timestamps were accurate if not then leave them empty
  var begin_time = tarray[0]; // format is YYYY-MM-DD HH24:MI:SS
  var end_time = tarray[tarray.length - 1]; // format is YYYY-MM-DD HH24:MI:SS
  pWin.XC.pWin.JQ('#xcMUCPostForm #chat_type').val('group_chat');
  pWin.XC.pWin.JQ('#xcMUCPostForm #title').val(JQ('#subject').val());
  pWin.XC.pWin.JQ('#xcMUCPostForm #begin_time').val(begin_time);
  pWin.XC.pWin.JQ('#xcMUCPostForm #end_time').val(end_time);
  pWin.XC.pWin.JQ('#xcMUCPostForm #participants').val(participants.join('\r\n'));
  pWin.XC.pWin.JQ('#xcMUCPostForm #body').val(body.join('\r\n'));
  pWin.XC.pWin.document.forms['xcMUCPostForm'].submit();
  return false;
};

/**
 * Send Message to the XMPP server, msg is not put in the msg_pane. The XMPP
 * server will broadcast the message back to everyone including this client.
 */
function xcMsgSend() {
  if ((body = JQ('#mbody').val()) != '') {
    pWin.xcMsgSend(body, pWin.xcDec(window.name), null, 'groupchat');
    JQ('#mbody').val('');
  };
  JQ('#mbody')[0].focus();
};

/**
 * Sends packet to change the subject of the MUC room if subject was changed
 * @param {String} subject The new subject
 */
function xcSubjectChange(subject) {
  if (typeof(subject) != 'undefined' && subject != '' && subject != oldsubject) {
    oldsubject = subject;
    pWin.xcMsgSend(null, pWin.xcDec(window.name), subject, 'groupchat');
  };
};

/**
 * Sends packet to change the users nickname in the MUC
 * @param {String} nick The new nickname for the users
 */
function xcNickChange(nick) {
  if (typeof(nick) == 'undefined' || nick == '' || nick == nickname) {
    return false;
  };
  oldnick = nickname;
  nickname = nick;
  try {
    var p = new JSJaCPresence(); // create presence packet with the new nickname and send it
    p.setTo(pWin.xcDec(window.name) + '/' + nickname);
    pWin.con.send(p);
  } catch (e) {
    xcSetMsg(e.message, true, true);
    nickname = oldnick; // failed to change so make sure we change it back
  };
};

/**
 * Handle any error packets that are sent to the window
 * @param {JSJaCPacket} p Error packet that arrives
 */
function xcError(p) {
  if (!p) { return true; };
  xcSetMsg(pWin.xcErrorProcess(p), true, true);
  return true;
};

/**
 * Handle incoming messages for the MUC
 * @param {JSJaCMessage} m, packet with the message in it
 */
function xcMsgGet(m) {
  var alias = pWin.xcJID(m.getFrom(), true);
  var date = pWin.xcDelayedDelivery(m); // for XEP-0091 and XEP-0203 compatibility
  var subject = m.getSubject().htmlEnc();
  var body = m.getBody().htmlEnc();
  if (subject != '') {
    if (body == '') {
      var html = '<div class="xcSystemMessage xcTopicChange">' + pWin.xcT('Topic has been changed to') + ': ' + subject + '</div>';
    } else {
      var html = '<div class="xcSystemMessage xcTopicChange">' + body + '</div>';
    };
    JQ('#msg_pane').append(html).children(':last-child').each(function() {
      if ((currentscroll / maxscroll) < pWin.XC.scrollthreshold ) { return false; };
      this.scrollIntoView(false);
    });
    JQ('#xcMUCRoomSubject').html(subject);
    JQ('#subject').val(subject);
    oldsubject = subject; // setting the old subject so it can be checked against any changes we make to the subject
    return true;
  };
  // if the message has any body, add it to the msg pane for people to view
  if (body != '') {
    var html = '<div class="xcChatMessage ' + (alias == nickname ? 'sent' : 'received') + '">' +
               '<div class="xcChatMessageHeader">' +
               '<span class="xcChatMessageTimestamp">' + (pWin.XC.xc_showtimestamps == 1 ? date : '') + '</span>' +
               '<span class="xcChatMessageSender">' + alias + '</span> ' +
               '</div>' +
               '<p class="xcChatMessageBody">' + body + '</p>' +
               '</div>';
    JQ('#msg_pane').append(html).children(':last-child').each(function() {
      if ((currentscroll / maxscroll) < pWin.XC.scrollthreshold ) { return false; };
      this.scrollIntoView(false);
    });
  };
};

/**
 * Handles all presence packets that come in for the MUC
 * @param {JSJaCPacket} incoming presence packet
 */
function xcPresence(p) {
  if (!p) { return true; };
  // retrieve information from the packet
  var fulljid = p.getFrom();
  var alias = pWin.xcJID(fulljid, true);
  var jid = JQ(p.getDoc()).find('item').attr('jid'); // for non anonymous rooms
  if (p.getType() == 'error') {
    xcSetMsg(pWin.xcErrorProcess(p), true, true);
    // if the code is changing the nickname make sure we update the information
    if (JQ(p.getDoc()).find('error').attr('code') == 409) {
      if (oldnick != '') {
        nickname == oldnick;
        oldnick = '';
      };
    };
  } else if (p.getType() == 'unavailable') { // someone is leaving the room hence handle that
    if ((nick = JQ(p.getDoc()).find('item').attr('nick'))) {
      var html = "<div class='xcSystemMessage xcNickChange'><strong>" + alias + "</strong> " + pWin.xcT('is changing there nickname to') + ": " + nick + "</div>";
      JQ('#msg_pane').append(html).children(':last-child').each(function() {
        if ((currentscroll / maxscroll) < pWin.XC.scrollthreshold ) { return false; };
        this.scrollIntoView(false);
      });
      // check if the user already had a window open for one on one chat via group chat
      if ((w = pWin.xcWinOpenGet(pWin.xcDec(window.name) + '/' + alias))) {
        w.name = pWin.xcEnc(pWin.xcDec(window.name) + '/' + nick); // if so, update the window name for the chat
        w.JQ('#alias').html(nick); // use the JQuery handler on that page to update the page
      };
    };
    JQ('.xcMUCOccupant').each(function() { if (this.id == pWin.xcEnc(fulljid)) { JQ(this).remove(); }; });
    var html = "<div class='xcSystemMessage xcLeftRoom'><strong>" + alias + "</strong> " + pWin.xcT('has left the room') + (pWin.XC.xc_showtimestamps == 1 ? ' (' + pWin.xcDate() + ') ' : '') + "</div>";
    JQ('#msg_pane').append(html).children(':last-child').each(function() {
      if ((currentscroll / maxscroll) < pWin.XC.scrollthreshold ) { return false; };
      this.scrollIntoView(false);
    });
  } else {
    // check if the user is currently in the list, if so ignore adding them to the list
    var check = 0;
    JQ('.xcMUCOccupant').each(function() { if (this.id == pWin.xcEnc(fulljid)) { check = 1; return false; }; });
    // the user is not currently in the list hence new presence add them to the list
    if (check == 0) {
      var html = "<div id='" + pWin.xcEnc(fulljid) + "' class='xcMUCOccupant" + (alias == nickname ? " xcMUCCurrentUserContainer" : "") + "' " + (jid ? "jid='" + pWin.xcJID(jid, false) + "'" : '') + " oncontextmenu='return false;'>" + alias + "</div>";
      JQ('#muc_occupants').append(html);
      if (alias == nickname) {
        xcInsertNicknameEditor();
      }
      // set click handler for the MUC occupants
      xcSetOccupantClickOptions();
      var html = "<div class='xcSystemMessage xcEnteredRoom'><strong>" + alias + "</strong> " + pWin.xcT('has entered the room') + (pWin.XC.xc_showtimestamps == 1 ? ' (' + pWin.xcDate() + ') ' : '') + "</div>";
      JQ('#msg_pane').append(html).children(':last-child').each(function() {
        if ((currentscroll / maxscroll) < pWin.XC.scrollthreshold ) { return false; };
        this.scrollIntoView(false);
      });
    };
    // set the classes if the user sends show information into this
    JQ('.xcMUCOccupant').each(function() { if (this.id == pWin.xcEnc(fulljid)) { JQ(this).removeClass().addClass('xcMUCOccupant ' + p.getShow()); }; });
    if (check == 0) {
      var html = pWin.xcStatusProcess(p); // Group Chat presence packet arrived so send to status processor in parent window
      if (html != '') {
        JQ('#msg_pane').append(html).children(':last-child').each(function() {
          if ((currentscroll / maxscroll) < pWin.XC.scrollthreshold ) { return false; };
          this.scrollIntoView(false);
        });
      };
    };
  };
  return true;
};

/**
 * Send packet to get the room listing from the conference server
 */
function xcGetRooms(server) {
  if (typeof(server) == 'undefined' || server == '') {
    xcSetMsg(pWin.xcT('No server has been selected to query'), true, true);
    return false;
  };
  try {
    var iq = new JSJaCIQ();
    iq.setType('get');
    iq.setTo(server);
    iq.setQuery(pWin.NS_DISCO_ITEMS);
    pWin.con.send(iq, window.xcListRooms);
    xcSetMsg('<img src="img/spinner.gif" /> ' + pWin.xcT('retrieving available rooms'), false, false);
  } catch (e) {
    xcSetMsg(e.message, true, true);
  };
};

/**
 * Receives room request packet and displays any information received
 * @param {JSJaCIQ} iq IQ result packet with the pertinent information
 */
function xcListRooms(iq) {
  xcMsgClear(); // clear the spinner from the view
  var html = '';
  // going through each query child node to get the relevant information
  JQ(iq.getDoc()).find('item').each(function() {
    var jid = pWin.xcEnc(JQ(this).attr('jid')); // room jid
    var description = JQ(this).attr('name'); // room description
    var name = JQ(this).attr('jid').split('@')[0];
    html += '<tr id="'+ jid +'" class="xcRoom"><td>' + name + '</td><td>' + description + '</td></tr>';
    html += '<tr><td colspan="2"><div id="' + jid + '_data" class="xcRoomData"></div></td></tr>';
  });
  // if any previous query records were there, remove them and show only records from the new query
  if (JQ('#roomlist').find('.xcRoomData').size() > 0) { JQ('#roomlist').find('.xcRoomData').parents('tr').remove(); };
  if (JQ('#roomlist').find('.xcRoom').size() > 0) { JQ('#roomlist').find('.xcRoom').remove(); };
  JQ('#roomlist').append(html); // setting the value of the div
  // setting the click components room links
  JQ('.xcRoom').unbind().click(function() {
    JQ('tr.xcSelected').removeClass('xcSelected');
    JQ(this).addClass('xcSelected');
    JQ('#room').val(pWin.xcDec(this.id));
    JQ('#nickname').val(pWin.XC.nickname);
    if (!JQ('#nickname').attr('disabled')) { JQ('#nickname').attr('disabled', 'disabled'); };
    xcMUCReservedNick(pWin.xcDec(this.id)); // check if the room has a reserved nickname or not for the user
  });
  return true;
};

/**
 * Get specific information regarding the actual room
 */
function xcGetRoomInfo(room) {
  if (typeof(room) == 'undefined' || room == '') {
    xcSetMsg(pWin.xcT('No room selected'), true, true);
    return false;
  };
  try {
    var iq = new JSJaCIQ();
    iq.setType('get');
    iq.setTo(pWin.xcDec(room));
    iq.setQuery(pWin.NS_DISCO_INFO);
    pWin.con.send(iq, window.xcShowRoomInfo);
    JQ('.xcRoomData').html('').hide('slow'); // hiding any currently displayed Group Chat room information
  } catch (e) {
    xcSetMsg(e.message, true, true);
  };
};

/**
 * Show information regarding the room
 */
function xcShowRoomInfo(iq) {
  if(!iq) { return true; };
  var html = '';
  var jid = pWin.xcEnc(iq.getFrom() + '_data');
  // retrieve all the feature information first
  JQ(iq.getDoc()).find('feature').each(function() { html += '<div>' + xcMUCProperties(JQ(this).attr("var")) + '</div>'; });
  // retrieve all the extra field information in the x variable
  JQ(iq.getDoc()).find('field').each(function() {
    if (label = JQ(this).attr('label')) {
      var value = JQ(this).children(':first-child').text();
      html += '<div>' + label + ': ' + value + '</div>';
    };
  });
  JQ('#' + jid).html(html).show('slow');
  return true;
};

/**
 * Send the query request to the server for the room occupants
 */
function xcGetRoomUsers(room) {
  if (typeof(room) == 'undefined' || room == '') {
    xcSetMsg(pWin.xcT('No room selected'), true, true);
    return false;
  };
  try {
    var iq = new JSJaCIQ();
    iq.setType('get');
    iq.setTo(pWin.xcDec(room));
    iq.setQuery(pWin.NS_DISCO_ITEMS);
    pWin.con.send(iq, window.xcShowRoomUsers);
    JQ('.xcRoomData').html('').hide('slow'); // hiding any currently displayed MUC room info
  } catch (e) {
    xcSetMsg(e.message, true, true);
  };
};

/**
 * Retrieve the occupants for the specific room
 * @param {JSJaCIQ} packet IQ stanza with pertinent room information
 */
function xcShowRoomUsers(iq) {
  if(!iq) { return true; };
  var jid = pWin.xcEnc(iq.getFrom() + '_data');
  if (JQ(iq.getQuery()).children().size() == 0) {
    var html = '<div>' + pWin.xcT('No occupant information was available from the server') + '</div>'; // private room or no occupants currently in the room
  } else {
    var html = '<div>' + pWin.xcT('Room has the following occupants') + '</div>';
    JQ(iq.getQuery()).children().each(function() { html += '<div>' + JQ(this).attr('jid') + '</div>'; });
  };
  JQ('#' + jid).html(html).show('slow');
  return true;
};

/**
 * Puts the User into an MUC room
 */
function xcEnterRoom() {
  if (!(nickname = JQ('#nickname').val()) || !(room = JQ('#room').val())) {
    xcSetMsg(pWin.xcT('No nickname chosen'), true, true);
    return false;
  };
  // check if we already have an group chat open for this room, if so use that one
  if ((w = pWin.xcWinOpenGet(room))) {
    w.focus();
    pWin.xcWinOpenUpdate(w); // make sure we keep the openwins updated
    window.name = 'MUC';
    window.close();
    return false;
  };
  // retrieving the chat portion so it can be displayed on screen
  JQ.get('muc.chat.html', function(result) { JQ('#workspace').html(result); });
  try {
    var p = new JSJaCPresence();
    p.setTo(room + '/' + nickname);
    p.appendNode(p.buildNode('x', {xmlns: pWin.NS_MUC}));
    window.name = pWin.xcEnc(room); // setting the window name to the room at this point
    pWin.con.send(p, window.xcEnterRoomVerify);
  } catch (e) {
    xcSetMsg(e.message, true, true);
  };
};

/**
 * Puts the User into an MUC room
 */
function xcEnterRoomInvite(room) {
  if (typeof(room) == 'undefined' || room == '') { return false; };
  // retrieving the chat portion so it can be displayed on screen
  JQ.get('muc.chat.html', function(result) { JQ('#workspace').html(result); });
  if (pWin.XC.unload_nick != '') {
    nickname = pWin.XC.unload_nick;
    pWin.XC.unload_nick = '';
  };
  try {
    var p = new JSJaCPresence();
    p.setTo(room + '/' + nickname);
    p.appendNode(p.buildNode('x', {xmlns: pWin.NS_MUC}));
    window.name = pWin.xcEnc(room); // setting the window name to the room at this point
    pWin.con.send(p, window.xcEnterRoomVerify);
  } catch (e) {
    xcSetMsg(e.message, true, true);
  };
};

/**
 * Verify the user was able to enter the MUC room successfully
 * @param {JSJaCPresence} p. Presence packet from xmpp server
 */
function xcEnterRoomVerify(p) {
  if (!p) { return true; };
  if (p.isError()) {
    xcSetMsg(pWin.xcErrorProcess(p), true, true);
    window.name = 'MUC'; // set the window name back to MUC since we never entered the room successfully
    return true;
  };
  nickname = pWin.xcJID(p.getFrom(), true);
  JQ('#nick').val(nickname);
  var fulljid = pWin.xcJID(p.getFrom(), false) + '/' + nickname;
  var jid = JQ(p.getDoc()).find('item').attr('jid');
  // the user is not currently in the list hence new presence add them to the list
  if (JQ('#muc_occupants > #' + pWin.xcEnc(fulljid)).size() == 0) {
    var html = '<div id="' + pWin.xcEnc(fulljid) + '" class="xcMUCOccupant xcMUCCurrentUserContainer" ' + (jid ? "jid='" + pWin.xcJID(jid, false) + "'" : '') + ' oncontextmenu="return false;">' + nickname + '</div>';
    JQ('#muc_occupants').append(html);
    xcInsertNicknameEditor();
    xcSetOccupantClickOptions();
  };
  return true;
};

function xcInsertNicknameEditor() {
  var nickname = JQ('.xcMUCCurrentUserContainer').html();
  var html = '\
    <div id="xcMUCCurrentUser" class="clearfix">\
      <strong style="float:left">' + nickname + '</strong>\
      <a href="#" onclick="JQ(\'#xcMUCCurrentUser\').toggle();JQ(\'#xcMUCNickname\').toggle();JQ(\'#nick\').focus()" style="float:right;font-size:11px">Change</a>\
    </div>\
    <div id="xcMUCNickname" class="clearfix">\
      <input type="text" id="nick" value="" size="15" class="xcInput" style="float:left" /> <a href="#" onclick="JQ(\'#xcMUCCurrentUser\').toggle();JQ(\'#xcMUCNickname\').toggle();" style="float:right;font-size:11px">Cancel</a>\
    </div>'
  JQ('.xcMUCCurrentUserContainer').html(html);
  // change the nickname of the user in the group chat if the enter button is pressed
  JQ('#nick').keypress(function(e) {
    var keycode = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
    if (keycode == 13) {
      xcSetMsg('Changing...', false, true);
      xcNickChange(this.value);
      return false;
    };
    return true;
  });
}

/**
 * Close the MUC window when the user leaves the room send presence of
 * type unavailable to the room in order to tell it the user has left
 */
function xcLeaveRoom() {
  try {
    var p = new JSJaCPresence();
    p.setTo(pWin.xcDec(window.name) + '/' + nickname);
    p.setType('unavailable');
    pWin.con.send(p);
    pWin.xcWinClose(pWin.xcDec(window.name));
  } catch (e) {
    pWin.xcWinClose(pWin.xcDec(window.name));
  };
};

/**
 * Create a new MUC Chat Room
 */
function xcCreateRoom() {
  xcSetMsg('<img src="img/spinner.gif" /> ' + pWin.xcT('Create room request sent'), false, false);
  if (!(room = JQ('#roomname').val())) {
    xcSetMsg(pWin.xcT('Room name required'), true, true);
    return false;
  };
  if (!(nickname = JQ('#nickname').val())) {
    xcSetMsg(pWin.xcT('Valid nickname is required'), true, true);
    return false;
  };
  var server = JQ('#server').val() ? JQ('#server').val() : pWin.MUC;
  try {
    var p = new JSJaCPresence();
    p.setTo(room + '@' + server + '/' + nickname);
    p.appendNode(p.buildNode('x', {xmlns: pWin.NS_MUC_USER}));
    pWin.con.send(p, window.xcCreateRoomVerify);
  } catch (e) {
    xcSetMsg(room + ' ' + pWin.xcT('creation failed') + ': ' + e.message, true, true);
  };
};

/**
 * Verifies that the Room creation occurred and handles any error messages
 */
function xcCreateRoomVerify(p) {
  if (!p) { return true; };
  if (p.isError()) {
    xcSetMsg(pWin.xcErrorProcess(p), true, true);
    return true;
  };
  try {
    if (JQ('#configure').val() == 1) {
      var iq = new JSJaCIQ();
      iq.setType('get');
      iq.setTo(pWin.xcJID(p.getFrom(), false));
      iq.setQuery(pWin.NS_MUC_OWNER);
      pWin.con.send(iq, xcConfigRoom);
    } else {
      // room successfully created hence unlock the room
      var jid = pWin.xcJID(p.getFrom(), false);
      var iq = new JSJaCIQ();
      iq.setTo(jid);
      iq.setType('set');
      iq.appendNode(iq.buildNode('query', {xmlns: pWin.NS_MUC_OWNER},
                   [iq.buildNode('x', {xmlns: pWin.NS_XDATA, type: 'submit'})]));
      pWin.con.send(iq);
      JQ('#room').val(pWin.xcJID(p.getFrom(), false));
      xcEnterRoom();
      xcMsgClear();
    };
  } catch (e) {
    xcSetMsg(pWin.xcT('Un-lock failed') + ': ' + e.message, true, true);
  };
  return true;
};

/**
 * Sends message to the server to destroy the MUC room
 */
function xcDestroyRoom(room, reason) {
  if (typeof(room) == 'undefined' || room == '') {
    xcSetMsg(pWin.xcT('No room selected'), true, true);
    return false;
  };
  if (typeof(reason) == 'undefined' || reason == '') { reason = pWin.xcT('No reason given'); }; // reason for removing the room
  try {
    var iq = new JSJaCIQ();
    iq.setTo(room);
    iq.setType('set');
    iq.appendNode(iq.buildNode('query', {xmlns: pWin.NS_MUC_OWNER},
                  [iq.buildNode('destroy',
                  [iq.buildNode('reason', reason)])]));
    pWin.con.send(iq, function(iq) {
                        if (iq.isError()) {
                          xcSetMsg(pWin.xcErrorProcess(iq), true, true);
                          return true;
                        };
                        xcSetMsg(pWin.xcT('Room removed'), false, true);
                        xcGetRooms(JQ('#server').val());
                        return true;
                      });
  } catch (e) {
    xcSetMsg(e.message, true, true);
  };
};

/**
 * Will either display the form to configure the room, enter the room if no config is possible or display error message
 * @param {JSJaCIQ} iq IQ stanza with either the room form configuration in it or error information
 */
function xcConfigRoom(iq) {
  if (iq.isError()) {
    xcSetMsg(pWin.xcErrorProcess(iq), true, true);
    return true;
  };
  if (JQ(iq.getDoc()).find('x').size() == 0) {
    xcSetMsg(pWin.xcT('Configuration not allowed. Entering room'), false, true);
    xcEnterRoom();
    return true;
  } else {
    var title = JQ(iq.getDoc()).find('title').text();
    var instructions = JQ(iq.getDoc()).find('instructions').text();
    var html = '<form name="roomname_form" id="roomname_form">' +
               '<input type="hidden" id="room" value="' + pWin.xcJID(iq.getFrom(), false) + '" />' +
               '<input type="hidden" id="nickname" value="' + nickname + '" />' +
               '</form>' +
               '<div id="title">' + title + '</div>' + pWin.xcCreateForm(iq, 'configure-room-form', 'xcConfigRoomSend', true);
  };
  JQ('#workspace').html(html);
  xcMsgClear();
  return true;
};

/**
 * Sends the room configuration back to the server based on user input
 */
function xcConfigRoomSend() {
  if (!(room = JQ('#room').val())) {
    xcSetMsg(pWin.xcT('No data available'), true, true);
    return false;
  };
  try {
    var iq = new JSJaCIQ();
    iq.setType('set');
    iq.setTo(room);
    iq.setQuery(pWin.NS_MUC_OWNER);
    var x = iq.getDoc().createElement('x');
    x.setAttribute('xmlns', pWin.NS_XDATA);
    x.setAttribute('type', 'submit');
    JQ('#configure-room-form :input').each(function() {
      if ((value = JQ(this).val())) {
        var id = this.id;
        var f = iq.getDoc().createElement('field');
        f.setAttribute('var', id);
        if (typeof(value) == 'string') {
          var v = iq.getDoc().createElement('value');
          var t = iq.getDoc().createTextNode(value);
          v.appendChild(t);
          f.appendChild(v);
        } else {
          for (var i = 0; i < value.length; i++) {
            var v = iq.getDoc().createElement('value');
            var t = iq.getDoc().createTextNode(value[i]);
            v.appendChild(t);
            f.appendChild(v);
          }
        }
        x.appendChild(f);
      }
    });
    iq.getQuery().appendChild(x);
    pWin.con.send(iq, function(iq) {
                        if (iq.isError()) {
                          xcSetMsg(pWin.xcErrorProcess(iq), true, true);
                          return true;
                        };
                        xcSetMsg(pWin.xcT('Room configured'), false, true);
                        xcEnterRoom();
                        return true;
                      });
  } catch (e) {
    xcSetMsg(e.message, true, true);
  };
};

/**
 * Sends an invitation to a specific user to join in a group chat
 */
function xcInviteUser() {
  if (!(searchjid = JQ('#searchjid').val())) {
    xcSetMsg(pWin.xcT('No Chat ID information'), true, true);
    return false;
  };
  try {
    if ((imessage = JQ('#imessage').val())) { imessage = pWin.xcT('No reason given'); };
    var m = new JSJaCMessage();
    m.setTo(pWin.xcDec(window.name));
    m.appendNode(m.buildNode('x', {xmlns: pWin.NS_MUC_USER},
                 [m.buildNode('invite', {to: searchjid},
                 [m.buildNode('reason', imessage)])]));
    pWin.con.send(m);
    xcSetMsg(pWin.xcT('Invitiation sent to') + ': ' + searchjid, false, true);
    JQ('#xcMUCInviteForm').slideUp('fast'); // hiding the search popup if it was used
  } catch (e) {
    xcSetMsg(e.message, true, true);
  };
  // clearing the text fields in the search form so they can be used later if needed
  JQ('#userinvite :text').each(function() { JQ(this).val(''); });
};

/**
 * Retrieve the form for searching for users
 */
function xcMUCSearchForm() {
  var iq = pWin.xcUserSearchForm();
  if (typeof(iq) == "object") {
    pWin.con.send(iq, window.xcMUCSearchFormDisplay);
  } else {
    xcSetMsg(iq, true, true);
  };
};

/**
 * Display the Form for searching for users
 */
function xcMUCSearchFormDisplay(iq) {
  var html = pWin.xcUserSearchFormVrfy(iq, 'xcMUCUserSearch');
  if (html.substring(0, 6) == "Error:") {
    xcSetMsg(html, true, true);
  } else {
    JQ('#xcUserSearchDiv').html(html);
  };
  return true;
};

/**
 * Processing the user search form and send results to the server
 */
function xcMUCUserSearch() {
  var iq = pWin.xcUserSearch(JQ('#usersearch'));
  if (typeof(iq) == "object") {
    pWin.con.send(iq, window.xcMUCUserSearchResults);
  } else {
    xcSetMsg(iq, true, true);
  };
};

/**
 * Display the results of the user search query
 */
function xcMUCUserSearchResults(iq) {
  var html = pWin.xcUserSearchVrfy(iq);
  if (html.substring(0, 6) == "Error:") {
    xcSetMsg(html, true, true);
  } else {
    JQ('#xcUserSearchDiv').html(html);
    JQ('.xcUserSearchSelect').click(function() {
      JQ('#searchjid').val(this.id);
      JQ('#xcUserSearchDiv').html('');
    });
  };
  return true;
};

/**
 * Sets the necessary click functionality for the MUC Occupants
 */
function xcSetOccupantClickOptions() {
  JQ('div.xcMUCOccupant:not(.xcMUCCurrentUserContainer)').unbind().mousedown(function(e) {
    var buttoncode = e.which ? e.which : e.button; // msie specific checks does not support e.which
    var pageX = e.pageX ? e.pageX : e.clientX; // msie specific checks does not support e.page
    var pageY = e.pageY ? e.pageY : e.clientY; // msie specific checks does not support e.page
    var id = pWin.xcDec(this.id); // retrieve the id of the current div we are binding the function too
    var jid = JQ(this).attr('jid'); // get the jid incase we need it later
    JQ('#xcMUC #xcMUCOccupants .xcMUCOccupant.selected').removeClass('selected');
    JQ(this).addClass('selected');

    if (buttoncode != 1) {
      JQ('#xcRightMenu').css({ top: pageY + 'px', left: pageX + 'px' }).show();
      JQ(document).one("click" , function() { JQ('#xcRightMenu').hide(); });
    } else {
      // as long as it is not the current user then we can do the one on one message
      if (!JQ(this).hasClass('xcMUCCurrentUserContainer')) {
        pWin.xcMsgUser(id);
      };
    };
    // bindings to the functionality in the right click menu
    JQ('.xcContextMenu > ul > li').unbind().click(function() {
      if (this.id == 'ban') {
        if (jid) {
          xcBanUser(jid);
        } else {
          xcSetMsg(pWin.xcT('Permission Denied'), false, true);
        };
      } else if (this.id == 'chat') {
        pWin.xcMsgUser(id); // open a one on one chat session with the user
      } else if (this.id == 'info') {
        pWin.xcUserInfo(id); // try and retrieve the users information
      } else if (this.id == 'kick') {
        xcKickUser(pWin.xcJID(id, true));
      } else if (this.id == 'subscribe') {
        if (jid) {
          if (!(contact =  pWin.xcContactExists(jid))) {
            var group = new Array('General');
            pWin.xcUpdateUser(jid, jid, group);  // putting user in default group with jid
            pWin.xcSendPresenceType(jid, 'subscribe');
            xcSetMsg(pWin.xcT('Subscription request sent'), false, true);
          } else {
            xcSetMsg(pWin.xcT('Contact already exists in your roster'), false, true);
          };
        } else {
          xcSetMsg(pWin.xcT('Anonymous room'), false, true);
        };
      };
    }).mouseover(function() { JQ(this).addClass('xcOver'); }).mouseout(function() { JQ(this).removeClass('xcOver'); });
  });
};

/**
 * Attempt to ban the user from the MUC Chat
 * @param {String} jid JID of the user to be banned
 */
function xcBanUser(jid) {
  //FIXME: see if there is a way to let the user enter the reason
  if (!jid) { return false; };
  try {
    var iq = new JSJaCIQ();
    iq.setType('set');
    iq.setTo(pWin.xcDec(window.name));
    iq.appendNode(iq.buildNode('query', {xmlns: pWin.NS_MUC_ADMIN},
                 [iq.buildNode('item', {affiliation: 'outcast', jid: jid},
                 [iq.buildNode('reason', pWin.xcT('Banning you from the room'))])]));
    pWin.con.send(iq, function(iq) {
                        if (iq.isError()) {
                          xcSetMsg(pWin.xcErrorProcess(iq), true, true);
                          return true;
                        };
                        xcSetMsg(pWin.xcT('User successfully banned from the Chatroom'), false, true);
                        return true;
                      });
  } catch (e) {
    xcSetMsg(e.message, true, true);
  };
};

/**
 * Attempt to kick a user from the MUC chat
 * @param {String} nick Nickname of the person to kick
 */
function xcKickUser(nick) {
  //FIXME: see if there is a way to let the user enter the reason
  if (!nick) { return false; };
  try {
    var iq = new JSJaCIQ();
    iq.setTo(pWin.xcDec(window.name)); // name of the Group Chat
    iq.setType('set');
    iq.appendNode(iq.buildNode('query', {xmlns: pWin.NS_MUC_ADMIN},
                  [iq.buildNode('item', {nick: nick, role: 'none'},
                  [iq.buildNode('reason', pWin.xcT('Kicking you from the room'))])]));
    pWin.con.send(iq, function(iq) {
                        if (iq.isError()) {
                          xcSetMsg(pWin.xcErrorProcess(iq), true, true);
                          return true;
                        };
                        xcSetMsg(pWin.xcT('User successfully kicked from the Chatroom'), false, true);
                        return true;
                      });
  } catch (e) {
    xcSetMsg(e.message, true, true);
  };
};

/**
 * Verify if the user has a reserved nickname for the room or not
 */
function xcMUCReservedNick(room) {
  if (typeof(room) == 'undefined' || room == '') {
    xcSetMsg(pWin.xcT('No room was selected'), true, true);
    return false;
  };
  try {
    var iq = new JSJaCIQ();
    iq.setTo(room);
    iq.setType('get');
    iq.appendNode(iq.buildNode('query', {xmlns: pWin.NS_DISCO_INFO, node: pWin.NS_X_ROOMUSER}));
    pWin.con.send(iq, window.xcMUCReservedNickVrfy);
    xcSetMsg(pWin.xcT('Checking for reserved nickname for that room'), false, false);
    aTimeout = setTimeout(function() { xcSetMsg(pWin.xcT('No reserved nickname response'), true, true); JQ('#nickname').removeAttr('disabled'); clearTimeout(aTimeout); }, pWin.XC.ERRORTIMEOUT);
  } catch (e) {
    xcSetMsg(e.message, true, true);
  };
};

/**
 * @param {JSJaCIQ} iq IQ stanza received back from the xmpp server
 */
function xcMUCReservedNickVrfy(iq) {
  if (!aTimeout) { return true; }; // already cleared because of timeout above hence do nothing here in the function
  xcMsgClear(); // clearing any message we received
  if (JQ('#nickname').attr('disabled')) { JQ('#nickname').removeAttr('disabled'); }; // remove disable attribute from nickname portion
  if (iq.isError()) {
    xcSetMsg(pWin.xcErrorProcess(iq), true, true);
    return true;
  };
  clearTimeout(aTimeout);
  // if query element does not have node = x-room-user then we know the server returned a disco info instead of the correct information so ignore it
  if (JQ(iq.getDoc()).find('query').attr('node') == pWin.NS_X_ROOMUSER) {
    JQ(iq.getDoc()).find('identity').each(function() {
      /* per disco info xep-0030, the identity child will be returned by the xmpp server
       * and category/type will be conference/text, if it is not that then ignore the child
       */
      if (JQ(this).attr('category') == 'conference' && JQ(this).attr('type') == 'text') {
        JQ('#nickname').val(JQ(this).attr('name')).attr('disabled', 'disabled');
      };
    });
  };
  return true;
};

/**
 * Returns human readable information about the MUC room property
 * @param {String} name the name of the property
 * @return {String} human readable information
 */
function xcMUCProperties(name) {
  if (name == 'http://jabber.org/protocol/disco#info') { return pWin.xcT('Discovery protocol available'); };
  if (name == 'http://jabber.org/protocol/muc') { return pWin.xcT('Support for MUC protocol'); };
  if (name == 'http://jabber.org/protocol/muc#register') { return pWin.xcT('Support for muc#register'); };
  if (name == 'http://jabber.org/protocol/muc#roomconfig') { return pWin.xct('Support for muc#roomconfig'); };
  if (name == 'http://jabber.org/protocol/muc#roominfo') { return pWin.xcT('Support for muc#roominfo'); };
  if (name == 'muc_hidden') { return pWin.xcT('Hidden room'); };
  if (name == 'muc_membersonly') { return pWin.xcT('Members Only room'); };
  if (name == 'muc_moderated') { return pWin.xcT('Moderated room'); };
  if (name == 'muc_nonanonymous') { return pWin.xcT('Non Anonymous room'); };
  if (name == 'muc_open') { return pWin.xcT('Open room'); };
  if (name == 'muc_passwordprotected') { return pWin.xcT('Password protected room'); };
  if (name == 'muc_persistent') { return pWin.xcT('Persistent room'); };
  if (name == 'muc_public') { return pWin.xcT('Public room'); };
  if (name == 'muc_rooms') { return pWin.xcT('List of MUC rooms'); };
  if (name == 'muc_semianonymous') { return pWin.xcT('Semi Anonymous room'); };
  if (name == 'muc_temporary') { return pWin.xcT('Temporary room'); };
  if (name == 'muc_unmoderated') { return pWin.xcT('Unmoderated room'); };
  if (name == 'muc_unsecured') { return pWin.xcT('Unsecured room'); };
  return ''; // return empty string is we do not understand the room property
}

function xcToggleRoomSubjectEditor() {
  JQ('#xcMUCRoomSubjectEditor').slideToggle('fast');
  JQ('#xcMUCRoomSubjectToggle').toggleClass('expanded');
  if (JQ('#xcMUCRoomSubjectToggle').hasClass('expanded')) {
    JQ('#xcMUCRoomSubjectToggle').html('Done');
  } else {
    xcSubjectChange(JQ('#subject').val());
    JQ('#xcMUCRoomSubjectToggle').html('Change');
  }
  return false;
}

// necessary start up manipulation of the DOM
JQ(document).ready(function() {
  JQ('.xcTabs').click(function() {
    JQ('.xcSelected').removeClass('xcSelected');
    JQ(this).addClass('xcSelected');
    JQ.get('muc.' + this.id + '.html', function(result) { JQ('#workspace').html(result); });
  });
  // if the name of the window is not MUC then group chat is being started via an invitation
  if (window.name == 'MUC') {
    JQ('#list').click();
  } else {
    if (pWin.XC.unload_nick == '') {
      nickname = (JQ(document).getUrlParam('nick')) ? JQ(document).getUrlParam('nick') : pWin.XC.nickname;
    } else {
      nickname = pWin.XC.unload_nick;
    };
    xcEnterRoomInvite(pWin.xcDec(window.name));
  };
});

// Clean up, while the window is being unloaded
JQ(window).unload(function() {
  if (window.name == 'MUC') {
     pWin.xcWinClose(pWin.xcDec(window.name));
  } else {
    xcLeaveRoom();
  };
  pWin.XC.unload_nick = nickname;
  pWin.xcUnloadNickClear(); // will clear it after predetermined time if the window was being closed completely
});
