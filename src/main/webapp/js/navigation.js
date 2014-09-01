((function(window) {
  /*
   * navigationMenubar() alustaa navigoinnin
   * navigointi on sidottu html ul elementtiin #nav id:llä
   *
   * @param(id string) id on sidottu navigaation juuri html ul elementtiin
   **/
  window.navigationMenubar = function(id){
    this.$id = $(id);

    this.$rootItems = this.$id.children('li'); // jQuerry array of all root menu items

    this.$items = this.$id.find('.menu-item');//.not('.separator'); // jQuery array of menu items

    this.$parents = this.$id.find('.menu-parent'); // jQuery array of menu items

    this.$allItems = this.$parents.add(this.$items); // jQuery array of all menu items

    this.$activeItem = null; // jQuery object of the menu item with focus
    this.bChildOpen = false; // true if child menu is open

    this.keys = {
      tab:    9,
      enter:  13,
      esc:    27,
      space:  32,
    };

    // bind event handlers
    bindHandlers();
  };

  /*
   * bindHandlers() lisää tapahtuman käsittelijät
   * navigaatio menuun
   * */
  function bindHandlers() {

    ///////// bind mouse event handlers //////////
    // bind a handler for the menu items
    this.$items.mouseenter(function(e) {
      $(this).addClass('menu-hover');
      return true;
    });

    // bind a mouseout handler for the menu items
    this.$items.mouseout(function(e) {
      $(this).removeClass('menu-hover');
      return true;
    });

    // bind a mouseenter handler for the menu parents
    this.$parents.mouseenter(function(e) {
      return handleMouseEnter($(this), e);
    });

    // bind a mouseleave handler
    this.$parents.mouseleave(function(e) {
      return handleMouseLeave($(this), e);
    });

    // bind a click handler
    this.$allItems.click(function(e) {
      return handleClick($(this), e);
    });

    //////////// bind key event handlers //////////////////
    // bind a keydown handler
    this.$allItems.keydown(function(e) {
      return handleKeyDown($(this), e);
    });

    // bind a focus handler
    this.$allItems.focus(function(e) {
      return handleFocus($(this), e);
    });

    // bind a blur handler
    this.$allItems.blur(function(e) {
      return handleBlur($(this), e);
    });

    // bind a document click handler
    $(document).click(function(e) {
      return handleDocumentClick(e);
    });

  } // end bindHandlers()

  /*
   * handleMouseEnter() process mouseover tapahtumaa päämenussa menun
   * @param($item object) jQuery object joka laukaisee tapahtuman
   * @param(e object) tapahtuma objekti
   * @return(boolean) return true
   * */
  function handleMouseEnter($item, e) {

    // add hover style
    $item.addClass('menu-hover');
    //sulkee sen menun jossa on focus
    this.$allItems.removeClass('menu-focus');
    this.$allItems.find('ul').not('.level-1-menu').hide().attr('aria-hidden','true');
    // expand the first level submenu
    if ($item.attr('aria-haspopup') == 'true') {
      $item.children('ul').show().attr('aria-hidden', 'false');
      this.bChildOpen = true;
    }
    //e.stopPropagation();
    return true;

  } // end handleMouseEnter()

  /*
   * handleMouseLeave() prosessoin mouseout tapahtumaa päämenussa
   *
   * @param($menu object) on jQuery objekti joka laukaisee tapahtuman
   * @param(e object) tapahtuma objekti
   * @return(boolean) palautaa boolen true/false
   * */
  function handleMouseLeave($menu, e) {

    var $active = $menu.find('.menu-focus');

    $active = $active.add($menu.find('.menu-focus'));

    // Remove hover style
    $menu.removeClass('menu-hover');

    // if any item in the child menu has focus, move focus to the root item
    if ($active.length > 0) {

      this.bChildOpen = false;

      // remove the focus style from the active item
      $active.removeClass('menu-focus');

      // store the active item
      this.$activeItem = $menu;

      // cannot hide items with focus -- move focus to root item
      $menu.focus();
    }

    // hide the child menu
    $menu.children('ul').hide().attr('aria-hidden', 'true');

    //e.stopPropagation();
    return true;

  } // end handleMouseLeave()

  /*
   * handleClick() prosessoi click tapahtumia päämenussa
   *
   * @param($item object) jQuery objekti joka laukaisee tapahtuman
   * @parem(e object) tapahtuma objekti
   * @return(boolea) palautta boolean true/false
   * */
  function handleClick($item, e) {

    var $parentUL = $item.parent();

    if ($parentUL.is('.level-1-menu')) {
      // open the child menu if it is closed
      $item.children('ul').first().show().attr('aria-hidden', 'false');
      this.bChildOpen = true;
    }
    else {
      // remove hover and focus styling
      this.$allItems.removeClass('menu-hover menu-focus');

      // close the menu
      this.$id.find('ul').not('.level-1-menu').hide().attr('aria-hidden','true');
    }

    // if menu item triggers some behavior other than going to a link,
    // would stop propagation and return false
    // e.stopPropagation();
    // return false;
    return true;

  } // end handleClick()

  /*
   * handleFocus() processoin focus tapahtumia menulle
   *
   * @param($item object) jQuery objekti joka laukaisee tapahtuman
   * @param(e object) tapahtuma objekti
   * @return(boolean) palauttaa boolen true/false
   * */
  function handleFocus($item, e) {
    // if activeItem is null, we are getting focus from outside the menu. Store
    // the item that triggered the event
    if (this.$activeItem == null) {
      this.$activeItem = $item;
    }
    else if ($item[0] != this.$activeItem[0]) {
      return true;
    }
    // get the set of jquery objects for all the parent items of the active item
    var $parentItems = this.$activeItem.parentsUntil('div').filter('li');

    // remove focus styling from all other menu items
    this.$allItems.removeClass('menu-focus');
    // remove hove styling form all menus if mouse is over during keyboard navigation
    this.$allItems.removeClass('menu-hover');
    // add styling to the active item
    this.$activeItem.addClass('menu-focus');

    if (this.$activeItem.hasClass('menu-parent')) {
      // for parent items, add .menu-focus directly to the list item
      this.$activeItem.addClass('menu-focus');
    }
    else {
      // for sub-menu items, add .menu-focus to the anchor
      this.$activeItem.find('a').addClass('menu-focus');
    }
    // add styling to all parent items.
    $parentItems.addClass('menu-focus');

    return true;

  } // end handleFocus()

  /*
   * hanleBlur() prosessoi fokusen poistumista
   * menu itemistä
   * @param($item object) on jQuery item objecti joka laukaisee tapahtuman
   * @param(e object) tapahtuman käsittelijä objekti
   * @return(boolean) palauttaa true
   * */
  function handleBlur($item, e) {
    $item.removeClass('menu-focus');
    return true;
  } // end handleBlur()

  /*
   * handleKeyDown prosessoi keydown tapahtumia menussa
   *
   * @param($item object) on jQuery item objecti joka laukaisee tapahtuman
   * @param(e object) tapahtuman käsittelijä objekti
   * @return(boolean) palauttaa boolean true/false
   * */
  function handleKeyDown($item, e) {

    if (e.altKey || e.ctrlKey) {
      // Modifier key pressed: Do not process
      return true;
    }

    var $itemUL = $item.parent();

    switch(e.keyCode) {
      case this.keys.tab: {
        this.$activeItem = moveToNext($item);
        break;
      }
      case this.keys.esc: {

        if ($itemUL.is('.level-1-menu')) {
          // hide the child menu and update the aria attributes
          $item.children('ul').first().hide().attr('aria-hidden', 'true');
        }
        else {

          // move up one level
          this.$activeItem = $itemUL.parent();

          // reset the childOpen flag
          this.bChildOpen = false;

          // set focus on the new item
          this.$activeItem.focus();

          // hide the active menu and update the aria attributes
          $itemUL.hide().attr('aria-hidden', 'true');
        }

        e.stopPropagation();
        return false;
      }
      case this.keys.enter:
      case this.keys.space: {

        window.location = $item.find('a').attr('href');
        e.stopPropagation();
        return false;
      }
    } // end switch
    return true;

  } // end handleKeyDown()

  /*
   * moveToNext() liikutaan menussa sen seuraavalle tasolle, joka voi olla seuraava
   * juuri tason menu tai vanhempi menun lapsi. Jos juuri taso on aktiiven taso, valikossa
   * tämä funktion looppaa sen ensimmäiseen tasoon
   *
   * jos menu on horisonttaalinen, ensimmäinen lapsi elementti valitusta menusta on valittuna
   *
   * @param($item object) on aktivoitu menu itemi
   * @return(object) palauttaa seuraava itemin mihin siirrytään tai liikkuminen ei mahdollista
   * */
  function moveToNext($item) {

    var $itemUL = $item.parent(); // $item's containing menu
    var $menuItems = $itemUL.children('li'); // the items in the currently active menu
    var menuNum = $menuItems.length; // the number of items in the active menu
    var menuIndex = $menuItems.index($item); // the items index in its menu
    var $newItem = null;
    var $newItemUL = null;

    if ($itemUL.is('.level-1-menu')) {
      // this is the root level move to next sibling. This will require closing
      // the current child menu and opening the new one.

      if (menuIndex < menuNum-1) { // not the last root menu
        $newItem = $item.next();
      }
      else { // wrap to first item
        $newItem = $menuItems.first();
      }

      // close the current child menu (if applicable)
      if ($item.attr('aria-haspopup') == 'true') {

        var $childMenu = $item.children('ul').first();

        if ($childMenu.attr('aria-hidden') == 'false') {
          // hide the child and update aria attributes accordingly
          $childMenu.hide().attr('aria-hidden', 'true');
          this.bChildOpen = true;
        }
      }

      // remove the focus styling from the current menu
      $item.removeClass('menu-focus');

      // open the new child menu (if applicable)
      if (($newItem.attr('aria-haspopup') == 'true') && (this.bChildOpen == true)) {

        var $childMenu = $newItem.children('ul').first();

        // open the child and update aria attributes accordingly
        $childMenu.show().attr('aria-hidden', 'false');

        // select the first item in the child menu
        $newItem = $childMenu.children('li').first();

      }
    }
    else {
      // this is not the root level. If there is a child menu to be moved into, do that;
      // otherwise, move to the next level-1-menu menu if there is one
      if ($item.attr('aria-haspopup') == 'true') {

        var $childMenu = $item.children('ul').first();

        $newItem = $childMenu.children('li').first();

        // show the child menu and update its aria attributes
        $childMenu.show().attr('aria-hidden', 'false');
        this.bChildOpen = true;
      }
      else {
        // at deepest level, move to the next level-1-menu menu

        var $parentMenus = null;
        var $rootItem = null;

        // get list of all parent menus for item, up to the root level
        $parentMenus = $item.parentsUntil('div').filter('ul').not('.level-1-menu');

        // hide the current menu and update its aria attributes accordingly
        $parentMenus.hide().attr('aria-hidden', 'true');

        // remove the focus styling from the active menu
        $parentMenus.find('li').removeClass('menu-focus');
        $parentMenus.last().parent().removeClass('menu-focus');

        $rootItem = $parentMenus.last().parent(); // the containing root for the menu

        menuIndex = this.$rootItems.index($rootItem);

        // if this is not the last root menu item, move to the next one
        if (menuIndex < this.$rootItems.length-1) {
          $newItem = $rootItem.next();
        }
        else { // loop
          $newItem = this.$rootItems.first();
        }

        if ($newItem.attr('aria-haspopup') == 'true') {
          var $childMenu = $newItem.children('ul').first();

          $newItem = $childMenu.children('li').first();

          // show the child menu and update it's aria attributes
          $childMenu.show().attr('aria-hidden', 'false');
          this.bChildOpen = true;
        }
      }
    }

    return $newItem;
  }

  /*
   * handleDocumentClick() prosessoi documentin click eventtiä
   * sulkeakseen avoimen menun kun käyttäjä klikkaa valikon ulkopuolelle
   * @param(e object) on tapahtuma objekti
   * @return(boolen) palautaa true
   * */
  function handleDocumentClick(e) {

    // get a list of all child menus
    var $childMenus = this.$id.find('ul').not('.level-1-menu');

    // hide the child menus
    $childMenus.hide().attr('aria-hidden', 'true');

    this.$allItems.removeClass('menu-focus');

    this.$activeItem = null;

    // allow the event to propagate
    return true;

  } // end handleDocumentClick()
})(window))