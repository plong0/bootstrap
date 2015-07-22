angular.module('ui.bootstrap.collapse', [])

  .directive('collapse', ['$animate', function ($animate) {

    return {
      link: function (scope, element, attrs) {
        var horizontal = element.hasClass('width');
        var contents;

        if(horizontal){
          // get all .content children so we can fix their width
          var children = element.children();
          for(var i=0; i < children.length; i++){
            var child = angular.element(children[i]);
            if(child.hasClass('content')){
              if(!contents){ contents = []; }
              contents.push(child);
            }
          }
        }
        function fixContentWidth(unfix){
          angular.forEach(contents, function(content){
            content.css({ width: unfix?'auto':content[0].scrollWidth+'px' });
          });
        }

        function expand() {
          element.removeClass('collapse')
            .addClass('collapsing')
            .attr('aria-expanded', true)
            .attr('aria-hidden', false);

          var animate = { to: {} };
          if(horizontal){
            animate.to.width = element[0].scrollWidth + 'px';
            fixContentWidth();
          }
          else{
            animate.to.height = element[0].scrollHeight + 'px';
          }

          $animate.addClass(element, 'in', animate).then(expandDone);
        }

        function expandDone() {
          var css = {};
          if(horizontal){
            css.width = 'auto';
            fixContentWidth(true);
          }
          else{
            css.height = 'auto';
          }

          element.removeClass('collapsing');
          element.css(css);
        }

        function collapse() {
          if(! element.hasClass('collapse') && ! element.hasClass('in')) {
            return collapseDone();
          }

          var css = {};
          var animate = { to: {} };

          if(horizontal){
            css.width = element[0].scrollWidth + 'px';
            animate.to.width = '0';
            fixContentWidth();
          }
          else{
            css.height = element[0].scrollHeight + 'px';
            animate.to.height = '0';
          }

          element
            // IMPORTANT: The height must be set before adding "collapsing" class.
            // Otherwise, the browser attempts to animate from height 0 (in
            // collapsing class) to the given height here.
            .css(css)
            // initially all panel collapse have the collapse class, this removal
            // prevents the animation from jumping to collapsed state
            .removeClass('collapse')
            .addClass('collapsing')
            .attr('aria-expanded', false)
            .attr('aria-hidden', true);

          $animate.removeClass(element, 'in', animate).then(collapseDone);
        }

        function collapseDone() {
          var css = {};
          if(horizontal){
            css.width = '0';
            fixContentWidth();
          }
          else{
            css.height = '0';
          }

          element.css(css); // Required so that collapse works when animation is disabled
          element.removeClass('collapsing');
          element.addClass('collapse');
        }

        scope.$watch(attrs.collapse, function (shouldCollapse) {
          if (shouldCollapse) {
            collapse();
          } else {
            expand();
          }
        });
      }
    };
  }]);
