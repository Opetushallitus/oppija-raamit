((function(window) {
  /*
   * navigationMenubar() alustaa navigoinnin
   * navigointi on sidottu html ul elementtiin #nav id:llä
   *
   * @param(id string) id on sidottu navigaation juuri html ul elementtiin
   **/
  window.navigationMenubar = function(id){
    this.$id = $(id);

    this.$items = this.$id.find('.menu-item'); // jQuery array of menu items

    this.$parents = this.$id.find('.menu-parent'); // jQuery array of menu items

    this.$allItems = this.$parents.add(this.$items); // jQuery array of all menu items

    this.keys = {
      enter:  13,
      esc:    27,
      space:  32
    };

    // bind event handlers
    bindHandlers();
  };

  /*
   * bindHandlers() lisää tapahtuman käsittelijät
   * navigaatio menuun
   * */
  function bindHandlers() {

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

  function closeMenus() {
    this.$allItems.removeClass('menu-focus');
    this.$allItems.find('ul').not('.level-1-menu').hide().attr('aria-hidden','true');
    this.$allItems.find("[aria-expanded='true']").attr('aria-expanded','false');
  }

  function openMenu($item) {
    $item.children('ul').show().attr('aria-hidden', 'false').attr('aria-expanded','true');
    $item.addClass('menu-focus');
  }

  /*
   * handleMouseEnter() process mouseover tapahtumaa päämenussa menun
   * @param($item object) jQuery object joka laukaisee tapahtuman
   * @param(e object) tapahtuma objekti
   * @return(boolean) return true
   * */
  function handleMouseEnter($item, e) {
    closeMenus();
    var $parentUL = $item.parent();
    // expand the first level submenu§
    if ($parentUL.is('.level-1-menu')) {
      openMenu($item)
    }
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

    closeMenus()
    $menu.focus();

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
      openMenu($item)
    }
    else {
      closeMenus()
    }

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
    this.$allItems.removeClass('menu-focus');

    // get the set of jquery objects for all the parent items of the active item
    var $parentItems = $item.parentsUntil('div').filter('li');

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

    var $parentUL = $item.parent();

    switch(e.keyCode) {

    case this.keys.esc: {
        closeMenus();
        if (!$item.is('.menu-parent')) {
          $item.parents('.menu-parent').children('a').first().focus();
        }
        e.stopPropagation();
        return false;
      }

    case this.keys.enter:
      case this.keys.space: {
        // expand the first level submenu
        if ($parentUL.is('.level-1-menu')) {
          if($item.find("[aria-expanded='false']").length > 0) {
            closeMenus();
            openMenu($item)
            e.stopPropagation();
            return false;
          }
        }
        return true;
      }
    } // end switch
    return true;

  } // end handleKeyDown()

  /*
   * handleDocumentClick() prosessoi documentin click eventtiä
   * sulkeakseen avoimen menun kun käyttäjä klikkaa valikon ulkopuolelle
   * @param(e object) on tapahtuma objekti
   * @return(boolen) palautaa true
   * */
  function handleDocumentClick(e) {

    closeMenus()

    // allow the event to propagate
    return true;

  } // end handleDocumentClick()
})(window))