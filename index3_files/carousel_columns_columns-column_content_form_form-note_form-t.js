
(function()
{var zoneFocusName=null;var resizeTimeout=null;var previousZoneWidth=null;function createZone(widget)
{var zones=widget.zones,name="zone";for(var num=1;typeof zones[name+num]=="object";++num);name+=num;var id=widget.id+"-zones__"+name;var li=$('<li></li>').addClass('widget-carousel-page-holder hidden');var control=$('<div></div>').addClass('control-zone control-zone bk-empty').attr('id',id).appendTo(li);var thumb=$('<li></li>').addClass('widget-carousel-thumb widget-carousel-thumb'+num+' prevent-select').html(num).appendTo(widget.$('thumbs'));thumb.mousedown(function(event)
{widget.animate(num);event.stopPropagation();event.preventDefault();});var lastZone=null;for(var ignore in zones)lastZone=zones[ignore];lastZone.$().removeClass('bk-last');lastZone.last=false;widget.$("view").append(li);var object=new BaseKit.Widget_Carousel_Page([{__name:name,__parentID:widget.id,__collection:"zones",__afterID:null,_hasSettings:false,_hasHelp:false,_hasData:true,"class":"widget-carousel-page",interact:"widget,formWidget",mode:"edit"},{zoneEmpty:false,widgetCreated:false},["save","buildSettings","injectWidget","insertWidget"],{widgets:[]}]);object.attach();widget.createZone(name,object.width);return control;}
function destroyZone(widget)
{var zones=widget.zones,last=null,editor=BaseKit.Editor.get();for(var name in zones)
{last=zones[name];}
if(last.$().length&&last.$().parent().length)
{last.$().parent().remove();}
last.destroySettingsPanels();last.destroy(true);editor.destroyObject(last.id);var thumb=widget.$('thumbs').children().last().remove();}
BaseKit.Widget_Carousel=BaseKit.Class.create({superclass:BaseKit.Framework_Widget,editor:{addPage:function()
{this.showWaiting();createZone(this);this.updatePageHeights();},removePage:function()
{var that=this;if(this.pages>1)
{this.showWaiting();destroyZone(this);this.$$("page-holder").each(function(i)
{var item=$(this);if(i==0)
{item.css({width:'auto',opacity:1.0,left:0});item.show();}
else
{item.hide();}});this.pages--;this.page=1;zoneFocusName='zone1';this.updatePageHeights();}}},methods:{construct:function()
{this.callParent.apply(this,arguments);this._autoHeight=true;this.highestValue=this.minHeight||40;zoneFocusName='zone1';this.isAnimating=false;this.animationInterval=null;this.autoTimeout=null;},attach:function()
{this.callParent.apply(this,arguments);this.updatePageHeights();var that=this;this.$("previous").mousedown(function()
{var pages=that.$$("page-holder");that.resetInterval();that.animate(that.page<=1?pages.length:(that.page-1));});this.$("next").mousedown(function()
{var pages=that.$$("page-holder");that.resetInterval();that.animate(that.page>=pages.length?1:(that.page+1));});this.$$("thumb").each(function(i)
{var item=$(this);item.mousedown(function(event)
{if(BaseKit.Framework_Page.isMode(['edit']))
{var selectedWidget=BaseKit.Editor.getSelectedWidget();if(selectedWidget!==null&&selectedWidget.id!=that.id)
{BaseKit.Editor.selectWidget(that);}}
event.stopPropagation();event.preventDefault();that.animate(i+1);});});var thisTimeout=setTimeout(function()
{clearTimeout(thisTimeout);that.setAnimationInterval(that.animationTime,false);},100);},showWaiting:function()
{$('.widget-carousel-settings-waiting-holder').show();},updatePagesNote:function()
{if(this.getSettingsPanel())
{var settings=this.getSettingsPanel();settings.pageQty(this.pages);}},updatePageHeights:function()
{var that=this,iterator=1,height=20,name='';this.minHeight=this.highestValue=40;this.$("view").css("minHeight","40px");for(var zoneName in this.zones)
{this.zones[zoneName].$().css("minHeight","40px");}
this.$$('page-holder').each(function()
{var item=$(this);name='zone'+iterator;if(!item.isVisible())
{item.show();height=item.height();item.hide();}
else
{height=item.height();}
if(height>that.highestValue)
{that.highestValue=height;}
iterator++;});this.minHeight=this.highestValue;this.$("view").css("minHeight",this.minHeight+"px");for(var zoneName in this.zones)
{this.zones[zoneName].$().css("minHeight",this.minHeight+"px");}
if(BaseKit.Framework_Page.isMode(['edit']))
{var selectedWidget=BaseKit.Editor.getSelectedWidget();if(selectedWidget!==null&&selectedWidget.id==this.id)
{BaseKit.Framework_Widget.positionDragHandles(this);}}},autoScroll:function()
{var that=this
clearTimeout(this.autoTimeout);if(this.animationTime>0)
{this.autoTimeout=setTimeout(function()
{clearTimeout(that.autoTimeout);var pages=that.$$("page-holder");that.resetInterval();that.animate(that.page>=(pages.length)?1:(that.page+1));that.autoScroll();},(this.animationTime*1000));}},onEnterPreviewMode:function()
{this.callParent.apply(this,arguments);var that=this
this.autoScroll();},onExitPreviewMode:function()
{this.callParent.apply(this,arguments);clearTimeout(this.autoTimeout);},animate:function(toPage)
{if(this.page==toPage)
{return;}
if(!this.isAnimating)
{var pages=this.$$("page-holder"),width=this.$('view').width(),height=this.$('view').height()-parseInt(this.$('view').css('paddingTop')),that=this;this.isAnimating=true;var backwards=(toPage>this.page)?false:true;var fromEl=pages.eq(this.page-1),toEl=pages.eq(toPage-1);switch(this.animation)
{case"slide":if(!BaseKit.Animation.addQueue({duration:0.5,onStart:function()
{toEl.addClass('bk-showing');toEl.show();toEl.css("left",(backwards?width:-width)+"px");if(BaseKit.Framework_Page.isMode(['edit','preview','themeselector']))
{$.each(that.zones['zone'+toPage].widgets,function(j,widget)
{if(widget instanceof BaseKit.Widget_Image&&typeof widget.onResize=='function')
{widget.onResize();}});}
that.$('view').css('minHeight',that.minHeight+'px');that.$('view').css('overflow','hidden');toEl.css('position','absolute');toEl.css('width',width+'px');toEl.css('height',height+'px');fromEl.css('position','absolute');fromEl.css('width',width+'px');fromEl.css('height',height+'px');that.$('thumb'+(that.page)).removeClass('selected');that.dispatch('onShow',that.highestValue);},onFinish:function()
{fromEl.hide();fromEl.removeClass('bk-showing');if(BaseKit.Framework_Page.isMode(['edit','themeselector','preview']))
{that.$('view').css('minHeight','auto');that.$('view').css('minHeight',that.minHeight+'px');}
else
{that.$('view').css('minHeight',that.minHeight+'px');}
zoneFocusName='zone'+toPage;that.$('view').css('overflow','visible');toEl.css('position','static');toEl.css('width','auto');toEl.css('height','auto');var wLength=0;for(var i in that.zones[zoneFocusName].widgets)
{wLength++}
if(wLength>0)
{toEl.css('height','auto');}
fromEl.css('position','static');fromEl.css('width','auto');fromEl.css('height','auto');that.$('thumb'+(toPage)).addClass('selected');that.isAnimating=false;that.page=toPage;}},{element:fromEl,left:[0,backwards?width:-width,"bothCubic"]},{element:toEl,left:[backwards?-width:width,0,"bothCubic"]}))
{return false;}
break;case"fade":default:var b4position=null;BaseKit.Animation.addQueue({onStart:function()
{fromEl.css("opacity",1.0);fromEl.show();b4position=toEl.css("position");toEl.css({position:"absolute",left:0,top:0,zIndex:999999,opacity:0.0});toEl.addClass('bk-showing');toEl.show();that.$('thumb'+(that.page)).removeClass('selected');},onFinish:function()
{fromEl.removeClass('bk-showing');fromEl.hide();toEl.css("position",b4position);zoneFocusName='zone'+toPage;that.$('thumb'+(toPage)).addClass('selected');that.dispatch('onShow',that.highestValue);that.isAnimating=false;that.page=toPage;}},{element:fromEl,opacity:[1.0,0,"bothQuad"]},{element:toEl,opacity:[0,1.0,"bothQuad"]});break;}}},toggleButtons:function()
{this.callParent.apply(this,arguments);this.showWaiting();if(this.buttonsEnabled==true)
{this.buttonsEnabled=false;this.$('previous').hide();this.$('next').hide();}
else
{this.buttonsEnabled=true;this.$('previous').show();this.$('next').show();}
this.save();},toggleThumbs:function()
{this.callParent.apply(this,arguments);this.showWaiting();if(this.thumbsEnabled==true)
{this.thumbsEnabled=false;this.$('thumbs').hide();}
else
{this.thumbsEnabled=true;this.$('thumbs').show();}
this.save();},setAnimationInterval:function(seconds,save)
{if(seconds>0)
{var milliseconds=seconds*1000;var that=this,pages=null;if(BaseKit.Framework_Page.isMode(['normal']))
{this.animationInterval=setInterval(function()
{pages=that.$$("page-holder");that.animate(that.page>=(pages.length)?1:(that.page+1));},milliseconds);}}
else
{this.resetInterval();}
this.animationTime=seconds;if(save&&save==true)
{this.save();}},resetInterval:function()
{clearInterval(this.animationInterval);},onStartMove:function()
{},onResize:function()
{var that=this;this.callParent.apply(this,arguments);if(previousZoneWidth!=null)
{for(var i in this.zones)
{$.each(that.zones[i].widgets,function(j,widget)
{var ratioWidthDifference=(that.$().width()/previousZoneWidth);if(widget instanceof BaseKit.Widget_Image)
{widget._paddingLeft=(widget._paddingLeft*ratioWidthDifference);widget._paddingRight=(widget._paddingRight*ratioWidthDifference);if(i==zoneFocusName)
{widget.onResize();}}});}}
previousZoneWidth=this.zones[zoneFocusName].$().width();},onFinishMove:function()
{this.updatePageHeights();this.dispatch('onMoveFinish');},onMoveFinish:function()
{this.callParent.apply(this,arguments);this.dispatch('onMoveFinish');}}});})();(function()
{var getWord={2:"two",3:"three",4:"four",5:"five",6:"six"};function createColumn(widget)
{var columns=widget.columns,name="column";for(var num=1;typeof columns[name+num]=="object";++num);name+=num;var id=widget.id+"-columns__"+name;var minHeight=(widget.parent instanceof BaseKit.Framework_Control_Row)?widget.parent.minHeight+'px':'10px';var control=$('<div></div>').addClass('control-zone widget-columns-column bk-empty').attr('id',id).css('minHeight',minHeight);var padding=$('<div></div>').addClass('widget-columns-column-padding bk-last').css('minHeight',minHeight).appendTo(control);var lastColumn=null;for(var ignore in columns)lastColumn=columns[ignore];lastColumn.$('padding').removeClass('bk-last');lastColumn.last=false;var columnAfter=$('#'+widget.id+'BKclear');control.insertBefore(columnAfter);var object=new BaseKit.Widget_Columns_Column([{__name:name,__parentID:widget.id,__afterID:null,__collection:"columns",_hasSettings:false,_hasData:true,"class":"widget-columns-column",tabIndex:-1,interact:"widget,formWidget",mode:"edit",styleName:'',neverEmpty:false,first:false,last:true,width:0,minusBorderMargin:0,udad:false},{zoneEmpty:false,widgetCreated:false},["save","buildSettings","injectWidget","insertWidget","setWidth","saveColumnWidth","saveStyleName","reloadStateCache","saveType","saveMinusBorderMargin"],{widgets:[]}]);object.attach(true);BaseKit.UndoManager.pushUndoState("columnCreate",{column:object,element:control,parent:widget,before:columnAfter!==null?columnAfter.attr('id'):null});widget.restore();widget.setGutterWidth(widget.gutterWidth);return control;}
function destroyColumn(widget,dontRestore,dontUndo)
{if(dontRestore!==true)
{dontRestore=false;}
if(dontUndo!==true)
{dontUndo=false;}
var columns=widget.columns,last=null,beforeLast=null;for(var name in columns)
{beforeLast=last;last=columns[name];}
BaseKit.Editor.destroyColumn(last,dontUndo,dontRestore);if(beforeLast!=null)
{beforeLast.$().addClass('bk-last');beforeLast.$('padding').addClass('bk-last');beforeLast.last=true;if(beforeLast.resizer!=null)
{beforeLast.resizer.hide();}}}
BaseKit.Widget_Columns=BaseKit.Class.create({superclass:BaseKit.Framework_Widget,editor:{construct:function()
{this._autoHeight=true;this.callParent.apply(this,arguments);if(this.topLevel===true)
{this.__unselectable=true;}
this.highlight=null;},attach:function()
{this.callParent.apply(this,arguments);if(BaseKit.Framework_Page.isMode(["edit","preview",'themeselector','admin']))
{if(typeof this.border!="undefined"&&this.border.length>0)
{this.border.remove();this.border=null;}
this.border=$('<div></div>').addClass(this.makeClass('border')+' widget-columns-border'+(BaseKit.Framework_Page.isMode(['preview','themeselector'])?' hidden':'')).css('opacity',0.5);this.highlight=$('<div></div>').addClass('widget-columns-resize-highlight hidden').css('opacity',0.3);this.$("content").append(this.highlight);this.$("content").append(this.border);this.onResize();}},onEnterPreviewMode:function()
{this.hideSettings();if(this.border)
{this.border.hide();}
this.hideMask();},onExitPreviewMode:function()
{this.showSettings();if(this.border)
{this.border.show();}
this.showMask();},onResize:function()
{this.callParent.apply(this,arguments);if(BaseKit.Framework_Page.isMode(['normal']))
{return;}
var columns=this.columns,column=null,row=null;for(var name in columns)
{columns[name].$('padding').css("minHeight","10px");columns[name].$().css("minHeight","10px");columns[name].$().css("height","auto");}
var region=this.$("content").getRegion(false,true);if(region&&region!==null)
{var largestColumnHeight=0;for(var name in columns)
{column=columns[name];if(largestColumnHeight<column.$().height())
{largestColumnHeight=column.$().height();}}
var height=largestColumnHeight;if(this._hasSettings==true)
{row=this.parent;if(height<row.minHeight)
{height=row.minHeight;}}
var leftGutter=Math.floor(this.gutterWidth/2),rightGutter=this.gutterWidth-leftGutter;;var parentRegion=this.$("content").getRegion(false,true);if(this.topLevel&&this.parent!=null&&this.parent instanceof BaseKit.Framework_Control_Row)
{if(height>this.parent.minHeight)
{this.parent.$().css("minHeight",this.parent.minHeight+"px");this.parent.$('content').css('minHeight',this.parent.minHeight+'px');this.$().css("minHeight",this.parent.minHeight+"px");this.$('content').css('minHeight',this.parent.minHeight+'px');}}
for(var name in columns)
{column=columns[name];if(column.$().height()<=height)
{column.$().css("minHeight",height+"px");column.$('padding').css("minHeight",Math.max((height-parseInt(column.minusBorderMargin)),0)+"px");}
var columnRegion=column.$().getRegion(false,true);if(column.resizer!=null&&column.resizer!=undefined)
{column.resizer.css("left",(columnRegion.right-parentRegion.left-leftGutter)+"px");column.resizer.css("width",(this.gutterWidth-2)+"px");}
column.onResize();}}
return height;},setColumns:function(number,leftColumnWidth,rightColumnWidth)
{var previousColumnWidths=[];var columns=this.columns,current=0,count=1,total=0;for(var i in columns)
{if(columns.hasOwnProperty(i))
{previousColumnWidths[i]=columns[i].$().width();++total;++current;}}
if(number>current)
{var currentCols=current;while(number>current)
{createColumn(this,++current,0);}
for(var name in this.columns)
{if(count>currentCols)
{if(this.columns.hasOwnProperty(name))
{var obj=this.columns[name];this.createColumn(name,obj.width);}}
count++;}}
else if(number<current)
{while(number<current)
{destroyColumn(this,false,false);current--;}
this.restore();}
if(number==2&&leftColumnWidth>0&&rightColumnWidth>0)
{var tempColumnFirst=null;var tempColumnSecond=null;for(name in this.columns)
{if(this.columns.hasOwnProperty(name))
{if(tempColumnFirst==null)
{tempColumnFirst=this.columns[name];}
else
{tempColumnSecond=this.columns[name];}}}
var parentRegion=this.$("content").getRegion(false,true);var column=tempColumnFirst;var theOther=tempColumnSecond;var columnRegion=column.$().getRegion(false,true);var leftGutter=Math.floor(this.gutterWidth/2);column.width=leftColumnWidth;column.$().css("width",leftColumnWidth+"%");column.saveColumnWidth(leftColumnWidth);theOther.width=rightColumnWidth;theOther.$().css("width",rightColumnWidth+"%");theOther.saveColumnWidth(rightColumnWidth);var leftColumnWidthPixels=column.$().width();column.resizer.css("left",(columnRegion.left+leftColumnWidthPixels-parentRegion.left-leftGutter)+"px");this.save();}
var that=this;for(var i in this.columns)
{$.each(that.columns[i].widgets,function(j,widget)
{var ratioWidthDifference=(that.columns[i].$().width()/previousColumnWidths[i]);if(widget instanceof BaseKit.Widget_Image)
{widget._paddingLeft=(widget._paddingLeft*ratioWidthDifference);widget._paddingRight=(widget._paddingRight*ratioWidthDifference);}});}
if(number==1&&total>1)
{for(var column in columns)
{if(columns.hasOwnProperty(column)&&typeof columns[column].removeStyle=='function')
{columns[column].removeStyle();}}}
this.onResize();},restore:function(forceZoneNonEmpty)
{if(forceZoneNonEmpty!==true)
{forceZoneNonEmpty=false;}
var columns=this.columns,count=0;for(var name in columns)++count;var last=count-1;var region=this.$("content").getRegion(false,true),totalWidth=region.right-region.left;var number=0,width=totalWidth/count;function getPercent(pixels)
{return BaseKit.Browser.ie?Math.round(100*pixels/totalWidth):parseFloat((100*pixels/totalWidth).toFixed(3));}
var leftGutter=Math.floor(this.gutterWidth/2);var accWidth=0;if(count>1)
{for(var name in columns)
{var column=columns[name],columnWidth=getPercent(width);if(number==0)
{column.$().addClass("bk-first");column.first=true;columnWidth=getPercent(width);accWidth+=columnWidth;}
else if(number==last)
{column.$().addClass("bk-last");column.last=true;columnWidth=parseFloat((BaseKit.Browser.ie?99:100)-accWidth).toFixed(3);accWidth+=columnWidth;}
else
{column.$().removeClass("bk-first");column.$().removeClass("bk-last");column.first=false;column.last=false;accWidth+=columnWidth;}
column.$().css("width",columnWidth+"%");column.width=columnWidth;++number;}}
else
{var column=null;for(name in columns)
{if(columns.hasOwnProperty(name)&&column==null)
{column=columns[name];}}
column.$().css("width","100%");column.width=100;if(column.resizer!=null)
{column.resizer.hide();}}
for(name in columns)
{columns[name].reset(forceZoneNonEmpty);}
var settings=this.getSettingsPanel();if(settings!==null)
{settings.controls["columns"].setValue(number);}},onSelect:function()
{if(this.__unselectable)
{return;}
this.callParent.apply(this,arguments);var columns=this.columns,zIndex=99;for(var name in columns)
{columns[name].$().css("zIndex",zIndex--);}}},methods:{onShow:function()
{var columns=this.columns;for(var name in columns)
{var column=columns[name];column.onShow();}},isEmpty:function()
{var amount=0;for(var column in this.columns)
{if(this.columns.hasOwnProperty(column))
{if(!this.columns[column].isEmpty())
{amount++;}}}
if(this.$('content').length>0&&amount>0)
{this.$('content').removeClass('bk-empty');}
else
{this.$('content').addClass('bk-empty');}
this.onResize();return(amount==0)?true:false;},setGutterWidth:function(width)
{this.gutterWidth=width;var leftGutter=(width>0?Math.floor(width/2):0),rightGutter=(width>0?width-leftGutter:0);this.$().find(".widget-columns-column-padding").css({marginLeft:leftGutter+"px",marginRight:rightGutter+"px"});this.$().find(".widget-columns-column-resize").css({right:(-rightGutter)+"px",width:(width>0?(width-2):0)+"px"});this.onResize();},createColumnOnSide:function(side,drag,sideWidth,widgetWidthWithoutPadding,dontUndo)
{var checkingFlag=false;if(checkingFlag===true)
{console.log('In createColumnOnSide for Widget: '+this.id);}
if(dontUndo!==true)
{dontUndo=false;}
var that=this,columns=this.columns,numberOfColumns=0,column=null,originalColumnWidth=0,columnsParentWidth=0,focusedColumn=null,focusedColumnWidth=0,newColumnWidthPercent=0,totalWidthsOfOtherColumnsPercent=0,nextToDropNewWidthPercent=0,widget=null,leftWidth=0,rightWidth=0,newColumnWidth=0,columnsWidgetPaddingBefore=null,columnsWidgetPaddingAfter=null;var data=drag.data();columnsParentWidth=this.parent.$().width();if(checkingFlag===true)
{console.log('The width of the parent element is: '+columnsParentWidth);}
var returnResultsFromCountColumns=this.countColumns(columns,null)
numberOfColumns=returnResultsFromCountColumns.numberOfColumn;if(checkingFlag===true)
{console.log('This columns widget has '+numberOfColumns+' columns');}
columnsWidgetPaddingBefore=this.getPadding();if(checkingFlag===true)
{console.log(['Columns Check',columns]);}
var tempColumnFirst=null;var tempColumnLast=null;for(name in columns)
{if(columns.hasOwnProperty(name))
{if(tempColumnLast==null)
{tempColumnFirst=columns[name];}
tempColumnLast=columns[name];}}
column=(side=='left')?tempColumnFirst:tempColumnLast;if(checkingFlag===true)
{console.log('The drag side is '+side+' so we are dealing with column '+column.__name);}
for(var i in columns)
{if(columns[i]!=column)
{focusedColumn=columns[i];focusedColumnWidth=focusedColumn.$().width();newColumnWidthPercent=parseFloat((100/columnsParentWidth)*focusedColumnWidth).toFixed(10);focusedColumn.width=newColumnWidthPercent;focusedColumn.$().css('width',newColumnWidthPercent+'%');totalWidthsOfOtherColumnsPercent=parseFloat(totalWidthsOfOtherColumnsPercent+newColumnWidthPercent).toFixed(10);}}
var region=this.getRegion(),regionLeft=0,regionRight=0;if(side=='left')
{this._paddingLeft=0;leftWidth=sideWidth;rightWidth=0;regionLeft=0;regionRight=region.right;}
else
{this._paddingRight=0;leftWidth=0;rightWidth=sideWidth;regionLeft=region.left;regionRight=0;}
this.setRegion(regionLeft,region.top,regionRight,region.bottom,region.height,null,null,true)
originalColumnWidth=parseInt(column.$().width());nextToDropNewWidthPercent=parseFloat(100-totalWidthsOfOtherColumnsPercent).toFixed(10);column.width=nextToDropNewWidthPercent;column.$().css('width',nextToDropNewWidthPercent+'%');newColumnWidth=parseInt(column.$().width());var firstWidget=null;for(var name in column.widgets)
{widget=column.widgets[name];if(firstWidget==null)
{firstWidget=widget;}
widget.addSpaceForOtherColumn(widget,newColumnWidth,originalColumnWidth,null,null,leftWidth,rightWidth)
widget.onResize(true,false);}
if(firstWidget!=null)
{if(data.data.type.substr(0,5)!="class")
{var movingWidgetBeforeId=data.data.value;var movingWidget=$bk(movingWidgetBeforeId);var movingWidgetBeforeName=movingWidget.__name;var previousParentOfMovingWidget=movingWidget.parent;var next=movingWidget.$().next();var movingWidgetAfter=(next&&typeof next.get(0)!='undefined'&&next.get(0)!=null&&typeof next.get(0).id!="undefined")?next.get(0):null;var movingWidgetAfterName=movingWidget.__name;}
var returnWidgetID=firstWidget.dropWidgetOnSide(side,drag,sideWidth,widgetWidthWithoutPadding,true,null);}
else
{this.syncColumns();}
columnsWidgetPaddingAfter=this.getPadding();this.onResize();this.savePadding(this._paddingLeft,this._paddingRight);if(!dontUndo)
{var undoParams={widget:firstWidget,scope:that,side:side,dragData:data,secondaryWidgetID:returnWidgetID,secondaryWidget:null,movingWidgetBefore:movingWidget,movingWidgetAfter:movingWidgetAfter,movingWidgetBeforeName:movingWidgetBeforeName,movingWidgetAfterName:movingWidgetAfterName,previousParentOfMovingWidget:previousParentOfMovingWidget,columnsWidget:that,column:column,columnsWidgetPaddingBefore:columnsWidgetPaddingBefore,columnsWidgetPaddingAfter:columnsWidgetPaddingAfter,columnObject:null,columnObjectEl:null,columnObjectElPadding:null,newColumnWidthPercent:newColumnWidthPercent,storedFirstColumnWidth:0}
BaseKit.UndoManager.pushUndoState("custom",{describe:'columns.createColumnOnSide',callback:function(isUndo,undoData)
{that.undoColumnsSideDrop(undoParams,isUndo);}});}},onColumnEmpty:function(column,mergeLeft,deletedWidget,movedWidget,originalParentOfMovingWidget,movedWidgetBeforeName)
{var that=this,columns=this.columns,nextColumn=null,applyToColumn=null,applyToColumnEl=null,moveWidget=null,widgetToMoveKey=null,widthOfDeletingColumn=0,columnPosition=0,columnToApplyWidthTo=null,numberOfColumns=0,numberOfColumnsMinusOne=0,widget=null,check=null,widthOfAllOtherColumns=0,widthOfAllColumnsBarIgnoredMergingColumns=0,mergeWithColumnNumber=0,deletingColumn=null,otherColumn=null,rightWidth=0,leftWidth=0,widthOfColumnInPercent=0,newWidth=0,applyPaddingToColumnsWidget=null,widgetBeforeStates=[],widgetAfterStates=[],idsAfterMove=[],namesAfterMove=[],idsBeforeMove=[],namesBeforeMove=[],idAfterMove=null,nameAfterMove=null,movingWidgetAfter=null,next=null,previousParentOfMovingWidget=null,movedWidgetAfterName=null,sideMerged='left',tempColumnFirst=null,tempColumnLast=null;var countColumnsArgs=this.countColumns(columns,column);numberOfColumns=countColumnsArgs.numberOfColumn;columnPosition=countColumnsArgs.widgetColumnPosition;numberOfColumnsMinusOne=numberOfColumns-1;applyToColumn=columns['column'+columnPosition],applyToColumnEl=applyToColumn.$();widthOfDeletingColumn=parseFloat(applyToColumnEl.width());for(name in columns)
{if(columns.hasOwnProperty(name))
{if(tempColumnLast==null)
{tempColumnFirst=columns[name];}
tempColumnLast=columns[name];}}
if(mergeLeft==false&&columnPosition!=numberOfColumns)
{mergeWithColumnNumber=(parseInt(columnPosition)+1);columnToApplyWidthTo=columns['column'+columnPosition];sideMerged='right';}
else if(columnPosition>1)
{mergeWithColumnNumber=(parseInt(columnPosition)-1);columnToApplyWidthTo=columns['column'+mergeWithColumnNumber];sideMerged='left';}
else
{mergeWithColumnNumber=2;columnToApplyWidthTo=tempColumnFirst;sideMerged='right';}
var widthOfOriginalColumn=columnToApplyWidthTo.$().width();if(numberOfColumnsMinusOne>1)
{var widthMinusColumnsReturnValues=this.widthOfAllOtherColumns(applyToColumn,this.columns,mergeWithColumnNumber);widthOfAllColumnsBarIgnoredMergingColumns=widthMinusColumnsReturnValues.allColumnsBarIgnoredMergingColumns;widthOfAllOtherColumns=widthMinusColumnsReturnValues.allColumnsBarIgnoredColumn;widthOfColumnInPercent=parseFloat((100-parseFloat(widthOfAllOtherColumns)).toFixed(10));for(var countdown=columnPosition;countdown<numberOfColumns;countdown++)
{nextColumn=columns['column'+(countdown+1)];this.shiftColumnWidthToColumnLeft(applyToColumn,nextColumn);applyToColumn=this.shiftWidgetsToColumn(applyToColumn,nextColumn);applyToColumnEl=applyToColumn.$();}
columns['column'+(numberOfColumns)].width=parseFloat(widthOfOriginalColumn);var columnObject=columns['column'+(numberOfColumns)];var columnObjectEl=columnObject.$();var columnObjectElPadding=columnObject.$('padding');destroyColumn(this,true,true);this.reloadStateCache();newWidth=parseFloat((100-parseFloat(widthOfAllColumnsBarIgnoredMergingColumns)).toFixed(10));columnToApplyWidthTo.width=newWidth;columnToApplyWidthTo.$().css('width',newWidth+'%');var firstWidget=null;for(var name in columnToApplyWidthTo.widgets)
{widget=columnToApplyWidthTo.widgets[name];if(firstWidget===null)
{firstWidget=widget;}
widgetBeforeStates.push({columnsWidgetPaddingBefore:widget.getPadding()})
this.addColumnPaddingToWidgetOrColumns(widget,columnToApplyWidthTo,widthOfOriginalColumn,widthOfDeletingColumn,widthOfColumnInPercent,mergeLeft,columnPosition,numberOfColumns,applyPaddingToColumnsWidget);widgetAfterStates.push({columnsWidgetPaddingAfter:widget.getPadding()})}
for(name in columns)
{columns[name].saveColumnWidth(columns[name].width);columns[name].reset();}
var settings=this.getSettingsPanel();if(settings!==null)
{settings.controls["columns"].setValue(numberOfColumnsMinusOne);}
this.syncColumns();if(movedWidget!=null)
{next=movedWidget.$().next();movingWidgetAfter=(next&&typeof next.get(0)!='undefined'&&next.get(0)!=null&&typeof next.get(0).id!="undefined")?next.get(0):null;movedWidgetAfterName=movedWidget.__name;}
var undoParams={scope:that,widget:firstWidget,widgetEl:(firstWidget!=null?firstWidget.$():null),columnsWidget:that,columnsWidgetEl:that.$(),sideWidth:widthOfDeletingColumn,widgetBeforeStates:widgetBeforeStates,widgetAfterStates:widgetAfterStates,deletedWidget:deletedWidget?deletedWidget:null,deletedWidgetEl:deletedWidget?deletedWidget.$():null,movedWidget:movedWidget?movedWidget:null,movedWidgetEl:movedWidget?movedWidget.$():null,movedWidgetBeforeName:movedWidgetBeforeName?movedWidgetBeforeName:null,movedWidgetAfterName:movedWidgetAfterName,originalParentOfMovingWidget:originalParentOfMovingWidget,previousParentOfMovingWidget:null,movingWidgetAfter:movingWidgetAfter,columnObject:columnObject,columnObjectEl:columnObjectEl,columnObjectElPadding:columnObjectElPadding,sideMerged:sideMerged}
BaseKit.UndoManager.pushUndoState("custom",{widget:widget,scope:that,describe:'columns.onColumnEmpty (keep columns widget)',callback:function(isUndo,undoData)
{that.undoColumnEmptyMultiColumn(undoParams,isUndo);}});}
else
{switch(columnPosition)
{case 1:deletingColumn=columns['column1'];otherColumn=columns['column2'];leftWidth=deletingColumn.$().width();break;case 2:deletingColumn=columns['column2'];otherColumn=columns['column1'];rightWidth=deletingColumn.$().width();break;}
if(otherColumn!=null)
{check=this.parent;while(check!=null&&!(check instanceof BaseKit.Framework_Page)&&!(check instanceof BaseKit.Widget_Columns_Column)&&!(check instanceof BaseKit.Framework_Control_Zone)&&!(check instanceof BaseKit.Widget_Carousel_Page)&&!(check instanceof BaseKit.Framework_Control_LibraryItem))
{check=check.parent;}
idsAfterMove=[];namesAfterMove=[];if((check instanceof BaseKit.Widget_Columns_Column)||(check instanceof BaseKit.Framework_Control_Zone)||(check instanceof BaseKit.Widget_Carousel_Page)||(check instanceof BaseKit.Framework_Control_LibraryItem))
{for(widgetToMoveKey in otherColumn.widgets)
{moveWidget=otherColumn.widgets[widgetToMoveKey];idsBeforeMove.push(moveWidget.id);namesBeforeMove.push(moveWidget.__name);widgetBeforeStates.push({columnsWidgetPaddingBefore:moveWidget.getPadding()})
idAfterMove=this.addColumnWidthToWidgetsPadding(check,otherColumn,moveWidget,leftWidth,rightWidth);nameAfterMove=$bk(idAfterMove).__name;idsAfterMove.push(idAfterMove);namesAfterMove.push(nameAfterMove);widgetAfterStates.push({columnsWidgetPaddingAfter:moveWidget.getPadding()})}}}
var nextWidgetElement=this.$().next();var nextWidgetID=(nextWidgetElement&&typeof nextWidgetElement.get(0)!='undefined'&&nextWidgetElement.get(0)!=null&&typeof nextWidgetElement.get(0).id!="undefined")?nextWidgetElement.get(0).id:null;BaseKit.Editor.destroyWidget(this,true,false);if(movedWidget!=null)
{previousParentOfMovingWidget=movedWidget.parent;next=movedWidget.$().next();movingWidgetAfter=(next&&typeof next.get(0)!='undefined'&&next.get(0)!=null&&typeof next.get(0).id!="undefined")?next.get(0):null;movedWidgetAfterName=movedWidget.__name;}
var undoParams={scope:that,widget:that,previousParent:that.parent,movingWidgetAfter:movingWidgetAfter,movedWidgetBeforeName:movedWidgetBeforeName,movedWidgetAfterName:movedWidgetAfterName,previousParentOfMovingWidget:previousParentOfMovingWidget,columnsWidget:that,columnsWidgetEl:that.$(),newColumn:deletingColumn,otherColumn:otherColumn,widgetBeforeStates:widgetBeforeStates,widgetAfterStates:widgetAfterStates,deletedWidget:deletedWidget?deletedWidget:null,movedWidget:movedWidget?$bk(movedWidget.id):null,idsAfterMove:idsAfterMove,namesAfterMove:namesAfterMove,idsBeforeMove:idsBeforeMove,namesBeforeMove:namesBeforeMove,nextWidgetID:nextWidgetID}
BaseKit.UndoManager.pushUndoState("custom",{widget:that,scope:that,describe:'columns.onColumnEmpty (destroy columns widget)',callback:function(isUndo,undoData)
{that.undoColumnEmptyRemoveColumns(undoParams,isUndo);}});}},splitColumn:function(newColumn,newColumnEl,otherColumn,otherColumnEl,contentEl,sideWidth,gutterWidth,widgetWidthWithoutPadding,columnsCollection)
{sideWidth=parseInt(sideWidth);widgetWidthWithoutPadding=parseInt(widgetWidthWithoutPadding);var parentRegion=contentEl.getRegion(false,true),parentWidth=parseFloat(parentRegion.right-parentRegion.left);var leftGutter=parseInt(Math.floor(gutterWidth/2));sideWidth=parseInt(sideWidth-leftGutter);widgetWidthWithoutPadding=parseFloat(widgetWidthWithoutPadding+leftGutter);var otherColumnsPercentageWidth=0,checkColumnEl=null;if(columnsCollection.hasOwnProperty)
{for(var column in columnsCollection)
{checkColumnEl=columnsCollection[column].$();if(checkColumnEl!=null&&checkColumnEl!=newColumnEl&&checkColumnEl!=otherColumnEl)
{otherColumnsPercentageWidth+=parseFloat(columnsCollection[column].width);}}}
var widthPercent=parseFloat((100/parentWidth)*parseFloat(sideWidth)).toFixed(3);var otherWidth=parseFloat(100-(parseFloat(otherColumnsPercentageWidth)+parseFloat(widthPercent))).toFixed(3);newColumn.width=widthPercent;newColumnEl.css("width",widthPercent+"%");otherColumn.width=otherWidth;otherColumnEl.css("width",otherWidth+"%");},countColumns:function(columns,column)
{var numberOfColumn=0,widgetColumnPosition=0,columnInfo={};for(var i in columns)
{numberOfColumn++;if(column!=null&&columns[i].id==column.id)
{widgetColumnPosition=numberOfColumn;}}
columnInfo={numberOfColumn:numberOfColumn,widgetColumnPosition:widgetColumnPosition}
return columnInfo;},getLastColumn:function(columns)
{var last=null;for(var name in columns)
{last=columns[name];}
return last;},getBeforeLastColumn:function(columns)
{var last=null,beforeLast=null;for(var name in columns)
{beforeLast=last;last=columns[name];}
return beforeLast;},addLastColumnProperties:function(column,columnEl,columnPaddingEl)
{columnEl=(columnEl?columnEl:column.$());columnPaddingEl=(columnPaddingEl?columnPaddingEl:column.$('padding'));columnEl.addClass('bk-last');columnPaddingEl.addClass('bk-last');column.last=true;},removeLastColumnProperties:function(column,columnEl,columnPaddingEl)
{columnEl=(columnEl?columnEl:column.$());columnPaddingEl=(columnPaddingEl?columnPaddingEl:column.$('padding'));columnEl.removeClass('bk-last');columnPaddingEl.removeClass('bk-last');column.last=false;},widthOfAllOtherColumns:function(ignoreColumn,columns,mergeWithColumnNumber)
{var returnValues={},widthOfAllColumnsBarIgnoredMergingColumns=0,widthOfAllOtherColumns=0;for(var c in columns)
{if(columns[c].id!=ignoreColumn.id)
{if(mergeWithColumnNumber>0&&columns[c].id!=columns['column'+mergeWithColumnNumber].id)
{widthOfAllColumnsBarIgnoredMergingColumns+=parseFloat(columns[c].width);}
widthOfAllOtherColumns+=parseFloat(columns[c].width);}}
returnValues={allColumnsBarIgnoredColumn:widthOfAllOtherColumns,allColumnsBarIgnoredMergingColumns:widthOfAllColumnsBarIgnoredMergingColumns}
return returnValues;},shiftColumnWidthToColumnRight:function(rightColumn,leftColumn)
{var rightColumnEl=rightColumn.$();rightColumn.width=leftColumn.width;rightColumnEl.css("width",leftColumn.width+"%");rightColumn.changeType('outer',leftColumn.type);rightColumn.applyColumnStyle(leftColumn.styleName,false,leftColumn.type);},shiftColumnWidthToColumnLeft:function(leftColumn,rightColumn)
{var leftColumnEl=leftColumn.$();leftColumn.width=rightColumn.width;leftColumnEl.css("width",rightColumn.width+"%");leftColumn.changeType('outer',rightColumn.type);leftColumn.applyColumnStyle(rightColumn.styleName,false,rightColumn.type);},shiftWidgetsToColumn:function(toColumn,fromColumn)
{var moveWidget=null;for(var widgetToMoveKey in fromColumn.widgets)
{moveWidget=fromColumn.widgets[widgetToMoveKey];fromColumn.$().removeClass('bk-last');fromColumn.$('padding').removeClass('bk-last');fromColumn.last=false;toColumn.moveWidget(moveWidget.id,null,{type:'widget',value:moveWidget.id},true,false,false);}
return fromColumn;},addColumnWidthToWidgetsPadding:function(column,otherColumn,widget,leftWidth,rightWidth)
{column.moveWidget(widget.id,this.id,{type:'widget',value:widget.id},true,false,false);var usePixels=(typeof widget._usePixels!="undefined"&&widget._usePixels);var rightMarginInPixels=usePixels?widget._paddingRight:Math.floor((otherColumn.$().width()/100)*widget._paddingRight);var leftMarginInPixels=usePixels?widget._paddingLeft:Math.floor((otherColumn.$().width()/100)*widget._paddingLeft);var relativeRightPaddingWidth=parseInt(rightWidth)+parseInt(rightMarginInPixels);var relativeLeftPaddingWidth=parseInt(leftWidth)+parseInt(leftMarginInPixels);widget.setRegion(relativeLeftPaddingWidth,null,relativeRightPaddingWidth,null,null,null,["left","right"]);if(typeof widget.onResize=='function')
{widget.onResize(['left','top','right','bottom']);}
if(BaseKit.Browser.webKit&&webKitOverlay&&webKitOverlay!==null)
{var webKitOverlay=BaseKit.Framework_Widget.getWebKitOverlay();BaseKit.Framework_Widget.removeWebKitOverlay();widget.$('content').append(webKitOverlay);}
widget.savePadding(widget._paddingLeft,widget._paddingRight);return widget.id;},addColumnPaddingToWidgetOrColumns:function(widget,columnToApplyWidthTo,widthOfOriginalColumn,widthOfDeletingColumn,widthOfColumnInPercent,mergeLeft,columnPosition,numberOfColumns,applyPaddingToColumnsWidget)
{var rightMarginInPixels=Math.floor((widthOfOriginalColumn/100)*widget._paddingRight);var leftMarginInPixels=Math.floor((widthOfOriginalColumn/100)*widget._paddingLeft);var relativeRightPaddingWidth=0;var relativeLeftPaddingWidth=0;if(mergeLeft==true)
{relativeRightPaddingWidth=parseInt(columnPosition>1?widthOfDeletingColumn:0)+parseInt(rightMarginInPixels);relativeLeftPaddingWidth=parseInt(columnPosition==1?widthOfDeletingColumn:0)+parseInt(leftMarginInPixels);}
else
{relativeLeftPaddingWidth=parseInt(columnPosition!=numberOfColumns?widthOfDeletingColumn:0)+parseInt(leftMarginInPixels);relativeRightPaddingWidth=parseInt(columnPosition==numberOfColumns?widthOfDeletingColumn:0)+parseInt(rightMarginInPixels);}
switch(applyPaddingToColumnsWidget)
{case'right':relativeRightPaddingWidth=0;widget.setRegion(relativeLeftPaddingWidth,null,widthOfColumnInPercent,null,null,null,["left","right"]);break;case'left':relativeLeftPaddingWidth=0;widget.setRegion(widthOfColumnInPercent,null,relativeRightPaddingWidth,null,null,null,["left","right"]);break;default:widget.setRegion(relativeLeftPaddingWidth,null,relativeRightPaddingWidth,null,null,null,["left","right"]);}
if(typeof widget.onResize=='function')
{widget.onResize(['left','top','right','bottom']);}
if(BaseKit.Browser.webKit&&webKitOverlay&&webKitOverlay!==null)
{var webKitOverlay=BaseKit.Framework_Widget.getWebKitOverlay();BaseKit.Framework_Widget.removeWebKitOverlay();widget.$('content').append(webKitOverlay);}
widget.savePadding(widget._paddingLeft,widget._paddingRight);},undoColumnsSideDrop:function(params,isUndo)
{var widget=params.widget,side=params.side,dragData=params.dragData,secondaryWidgetID=params.secondaryWidgetID,previousParentOfMovingWidget=params.previousParentOfMovingWidget,movingWidgetBefore=params.movingWidgetBefore,movingWidgetAfter=params.movingWidgetAfter,movingWidgetBeforeName=params.movingWidgetBeforeName,movingWidgetAfterName=params.movingWidgetAfterName,columnsWidget=params.columnsWidget,secondaryWidget=params.secondaryWidget,secondaryWidgetEl=params.secondaryWidgetEl,columnObject=params.columnObject,columnObjectEl=params.columnObjectEl,columnObjectElPadding=params.columnObjectElPadding,newColumnWidthPercent=params.newColumnWidthPercent,columnsWidgetPaddingBefore=params.columnsWidgetPaddingBefore,columnsWidgetPaddingAfter=params.columnsWidgetPaddingAfter;var columns=columnsWidget.columns,countColumnsArgs=columnsWidget.countColumns(columnsWidget.columns,widget.parent),numberOfColumn=countColumnsArgs.numberOfColumn,fromColumn=null,toColumn=null,countdown=0,last=null,name=null,beforeLast=null,removedColumnWidthFactor=null;if(secondaryWidget===null)
{params.secondaryWidget=secondaryWidget=$bk(params.secondaryWidgetID);params.secondaryWidgetEl=secondaryWidgetEl=$bk(params.secondaryWidgetID).$();}
if(isUndo)
{var deletingColumnWidth=(side=='left')?columns['column1'].width:columns['column'+numberOfColumn].width;if(dragData.data.type.substr(0,6)!="class.")
{previousParentOfMovingWidget.moveWidget(secondaryWidget.id,(movingWidgetAfter!=null?movingWidgetAfter.id:null),null,true,true,true,movingWidgetBeforeName);}
else
{BaseKit.Editor.destroyWidget(secondaryWidget,true,parseInt(BaseKit.UndoManager.getUndoPointer()));}
if(side=='left')
{fromColumn=null;toColumn=columns['column1'];for(countdown=1;countdown<numberOfColumn;countdown++)
{fromColumn=columns['column'+(countdown+1)];columnsWidget.shiftColumnWidthToColumnLeft(toColumn,fromColumn);toColumn=columnsWidget.shiftWidgetsToColumn(toColumn,fromColumn);}}
removedColumnWidthFactor=parseFloat(((parseFloat(deletingColumnWidth)/(numberOfColumn-1)).toFixed(10)));last=columnsWidget.getLastColumn(columnsWidget.columns);beforeLast=columnsWidget.getBeforeLastColumn(columnsWidget.columns);params.storedFirstColumnWidth=last.width;if(columnObject===null)
{params.columnObject=columnObject=last;params.columnObjectEl=columnObjectEl=last.$();params.columnObjectElPadding=columnObjectElPadding=last.$('padding');}
BaseKit.Editor.destroyColumn(columnObject,true,true,parseInt(BaseKit.UndoManager.getUndoPointer()));for(var c in columnsWidget.columns)
{columnsWidget.columns[c].width=parseFloat(columnsWidget.columns[c].width)+parseFloat(removedColumnWidthFactor);columnsWidget.columns[c].$().css('width',columnsWidget.columns[c].width+"%");}
if(beforeLast!=null)
{columnsWidget.addLastColumnProperties(beforeLast);}
var usePixels=(typeof columnsWidget._usePixels!="undefined"&&columnsWidget._usePixels);var rightMarginInPixels=usePixels?columnsWidgetPaddingBefore.right:Math.floor((columnsWidget.parent.$().width()/100)*columnsWidgetPaddingBefore.right);var leftMarginInPixels=usePixels?columnsWidgetPaddingBefore.left:Math.floor((columnsWidget.parent.$().width()/100)*columnsWidgetPaddingBefore.left);columnsWidget.setRegion(leftMarginInPixels,parseInt(columnsWidgetPaddingBefore.top),rightMarginInPixels,parseInt(columnsWidgetPaddingBefore.bottom),null,null,['left','right','top','bottom'],false);for(name in columnsWidget.columns)
{columnsWidget.columns[name].saveColumnWidth(columnsWidget.columns[name].width);columnsWidget.columns[name].reset();}}
else
{var usePixels=(typeof columnsWidget._usePixels!="undefined"&&columnsWidget._usePixels);var rightMarginInPixels=usePixels?columnsWidgetPaddingAfter.right:Math.floor((columnsWidget.parent.$().width()/100)*columnsWidgetPaddingAfter.right);var leftMarginInPixels=usePixels?columnsWidgetPaddingAfter.left:Math.floor((columnsWidget.parent.$().width()/100)*columnsWidgetPaddingAfter.left);columnsWidget.setRegion(leftMarginInPixels,parseInt(columnsWidgetPaddingAfter.top),rightMarginInPixels,parseInt(columnsWidgetPaddingAfter.bottom),null,null,['left','right','top','bottom'],false);removedColumnWidthFactor=parseFloat(((parseFloat(columnObject.width)/numberOfColumn).toFixed(10)));for(var c in columnsWidget.columns)
{columnsWidget.columns[c].width=parseFloat(columnsWidget.columns[c].width)-parseFloat(removedColumnWidthFactor);columnsWidget.columns[c].$().css('width',columnsWidget.columns[c].width+"%");}
BaseKit.Editor.restoreColumn(columnsWidget,columnObject,columnsWidget.id+'BKclear',columnObjectEl,parseInt(BaseKit.UndoManager.getUndoPointer()+1),true);beforeLast=columnsWidget.columns['column'+numberOfColumn];if(columnObject!=null&&beforeLast!=null)
{columnsWidget.addLastColumnProperties(columnObject,columnObjectEl,columnObjectElPadding);columnsWidget.removeLastColumnProperties(beforeLast);}
var applyToColumn=null;if(side=='left')
{applyToColumn=columnsWidget.columns['column1'];fromColumn=null;toColumn=columnsWidget.columns['column'+(numberOfColumn+1)];for(countdown=(numberOfColumn+1);countdown>1;countdown--)
{fromColumn=columnsWidget.columns['column'+(countdown-1)];columnsWidget.shiftColumnWidthToColumnRight(toColumn,fromColumn);toColumn=columnsWidget.shiftWidgetsToColumn(toColumn,fromColumn);}
applyToColumn.width=params.storedFirstColumnWidth;applyToColumn.$().css('width',applyToColumn.width+"%");}
else
{applyToColumn=columnObject;}
if(dragData.data.type.substr(0,6)!="class.")
{applyToColumn.moveWidget(movingWidgetBefore.id,null,null,true,true,true,movingWidgetAfterName);}
else
{BaseKit.Editor.restoreWidget(applyToColumn,secondaryWidget,null,secondaryWidgetEl,parseInt(BaseKit.UndoManager.getUndoPointer()+1));}
columnsWidget.savePadding(columnsWidget._paddingLeft,columnsWidget._paddingRight);for(name in columnsWidget.columns)
{columnsWidget.columns[name].saveColumnWidth(columnsWidget.columns[name].width);columnsWidget.columns[name].reset();}}},undoColumnEmptyMultiColumn:function(params,isUndo)
{var columnsWidget=params.columnsWidget,columnsWidgetEl=params.columnsWidgetEl,widget=params.widget,widgetEl=params.widgetEl,sideWidth=params.sideWidth,deletedWidget=params.deletedWidget,deletedWidgetEl=params.deletedWidgetEl,movedWidget=params.movedWidget,movedWidgetBeforeName=params.movedWidgetBeforeName,movedWidgetAfterName=params.movedWidgetAfterName,movedWidgetEl=params.movedWidgetEl,originalParentOfMovingWidget=params.originalParentOfMovingWidget,previousParentOfMovingWidget=params.previousParentOfMovingWidget,movingWidgetAfter=params.movingWidgetAfter,columnObject=params.columnObject,columnObjectEl=params.columnObjectEl,columnObjectElPadding=params.columnObjectElPadding,sideMerged=params.mergeLeft,widgetBeforeStates=params.widgetBeforeStates,widgetAfterStates=params.widgetAfterStates;var countColumnsArgs=null,widgetColumnPosition=null,numberOfColumn=null,beforeLast=null,last=null,fromColumn=null,toColumn=null,countdown=null,name=null,widgetPaddingBefore=null,widgetPaddingAfter=null,newColumn=null,otherColumn=null,pop=null,count=0;if(isUndo)
{BaseKit.Editor.restoreColumn(columnsWidget,columnObject,columnsWidget.id+'BKclear',columnObjectEl,BaseKit.UndoManager.getUndoPointer(),true);countColumnsArgs=columnsWidget.countColumns(columnsWidget.columns,(movedWidget!=null?originalParentOfMovingWidget:deletedWidget.parent));widgetColumnPosition=countColumnsArgs.widgetColumnPosition;numberOfColumn=countColumnsArgs.numberOfColumn;newColumn=columnsWidget.columns['column'+widgetColumnPosition];otherColumn=columnsWidget.columns['column'+((widgetColumnPosition!=1?parseInt(widgetColumnPosition)-1:parseInt(widgetColumnPosition)+1))];fromColumn=null,toColumn=last=columnsWidget.columns['column'+(numberOfColumn)];for(countdown=(numberOfColumn);countdown>((widgetColumnPosition==1)?1:widgetColumnPosition);countdown--)
{fromColumn=columnsWidget.columns['column'+(countdown-1)];columnsWidget.shiftColumnWidthToColumnRight(toColumn,fromColumn);toColumn=columnsWidget.shiftWidgetsToColumn(toColumn,fromColumn);}
var region=widgetEl.getRegion(false,true);var widgetWidthWithoutPadding=region.right-region.left-sideWidth;var contentEl=columnsWidgetEl;columnsWidget.splitColumn(newColumn,newColumn.$(),otherColumn,otherColumn.$(),contentEl,sideWidth,columnsWidget.gutterWidth,widgetWidthWithoutPadding,columnsWidget.columns);beforeLast=columnsWidget.getBeforeLastColumn(columnsWidget.columns)
if(last!=null&&beforeLast!=null)
{columnsWidget.addLastColumnProperties(last);columnsWidget.removeLastColumnProperties(beforeLast);}
pop=null,count=0;for(widget in otherColumn.widgets)
{pop=widgetBeforeStates[count];widgetPaddingBefore=pop.columnsWidgetPaddingBefore;var usePixels=(typeof otherColumn.widgets[widget]._usePixels!="undefined"&&otherColumn.widgets[widget]._usePixels);var rightMarginInPixels=usePixels?widgetPaddingBefore.right:Math.floor((otherColumn.$().width()/100)*widgetPaddingBefore.right);var leftMarginInPixels=usePixels?widgetPaddingBefore.left:Math.floor((otherColumn.$().width()/100)*widgetPaddingBefore.left);otherColumn.widgets[widget].setRegion(leftMarginInPixels,parseInt(widgetPaddingBefore.top),rightMarginInPixels,parseInt(widgetPaddingBefore.bottom),null,null,['left','right','top','bottom'],false);otherColumn.widgets[widget].savePadding(otherColumn.widgets[widget]._paddingLeft,otherColumn.widgets[widget]._paddingRight);count++;}
if(movedWidget!=null)
{params.previousParentOfMovingWidget=previousParentOfMovingWidget=movedWidget.parent;newColumn.moveWidget(movedWidget.id,null,null,true,true,true,movedWidgetBeforeName);}
else
{BaseKit.Editor.restoreWidget(newColumn,deletedWidget,null,deletedWidgetEl,BaseKit.UndoManager.getUndoPointer());}
for(name in columnsWidget.columns)
{columnsWidget.columns[name].saveColumnWidth(columnsWidget.columns[name].width);columnsWidget.columns[name].reset();}}
else
{var mergeWithColumnNumber=null,columnToApplyWidthTo=null;countColumnsArgs=columnsWidget.countColumns(columnsWidget.columns,(deletedWidget!=null?deletedWidget.parent:movedWidget.parent));widgetColumnPosition=countColumnsArgs.widgetColumnPosition;numberOfColumn=countColumnsArgs.numberOfColumn;newColumn=columnsWidget.columns['column'+widgetColumnPosition];if(widgetColumnPosition!=1)
{mergeWithColumnNumber=(parseInt(widgetColumnPosition)-1);columnToApplyWidthTo=columnsWidget.columns['column'+mergeWithColumnNumber];}
else
{mergeWithColumnNumber=2;columnToApplyWidthTo=columnsWidget.columns['column1'];}
if(movedWidget!=null)
{previousParentOfMovingWidget.moveWidget(movedWidget.id,(movingWidgetAfter!=null?movingWidgetAfter.id:null),null,true,true,true,movedWidgetAfterName);}
else if(deletedWidget!=null)
{BaseKit.Editor.destroyWidget(deletedWidget,true);}
var widthMinusColumnsReturnValues=columnsWidget.widthOfAllOtherColumns(columnsWidget.columns['column'+widgetColumnPosition],columnsWidget.columns,mergeWithColumnNumber);var widthOfAllColumnsBarIgnoredMergingColumns=widthMinusColumnsReturnValues.allColumnsBarIgnoredMergingColumns;fromColumn=null;toColumn=columnsWidget.columns['column'+((widgetColumnPosition!=1)?mergeWithColumnNumber:1)];for(countdown=((widgetColumnPosition!=1)?mergeWithColumnNumber:1);countdown<numberOfColumn;countdown++)
{fromColumn=columnsWidget.columns['column'+(countdown+1)];columnsWidget.shiftColumnWidthToColumnLeft(toColumn,fromColumn);toColumn=columnsWidget.shiftWidgetsToColumn(toColumn,fromColumn);}
var newWidth=parseFloat((100-parseFloat(widthOfAllColumnsBarIgnoredMergingColumns)).toFixed(10));last=columnsWidget.getLastColumn(columnsWidget.columns);beforeLast=columnsWidget.getBeforeLastColumn(columnsWidget.columns);BaseKit.Editor.destroyColumn(columnObject,true,true);if(beforeLast!=null)
{columnsWidget.addLastColumnProperties(beforeLast);}
columnToApplyWidthTo.width=newWidth;columnToApplyWidthTo.$().css('width',newWidth+'%');pop=null,count=0;for(widget in columnToApplyWidthTo.widgets)
{pop=widgetAfterStates[count];widgetPaddingAfter=pop.columnsWidgetPaddingAfter;var usePixels=(typeof columnToApplyWidthTo.widgets[widget]._usePixels!="undefined"&&columnToApplyWidthTo.widgets[widget]._usePixels);var rightMarginInPixels=usePixels?widgetPaddingAfter.right:Math.floor((columnToApplyWidthTo.$().width()/100)*widgetPaddingAfter.right);var leftMarginInPixels=usePixels?widgetPaddingAfter.left:Math.floor((columnToApplyWidthTo.$().width()/100)*widgetPaddingAfter.left);columnToApplyWidthTo.widgets[widget].setRegion(leftMarginInPixels,parseInt(widgetPaddingAfter.top),rightMarginInPixels,parseInt(widgetPaddingAfter.bottom),null,null,['left','right','top','bottom'],false);columnToApplyWidthTo.widgets[widget].savePadding(columnToApplyWidthTo.widgets[widget]._paddingLeft,columnToApplyWidthTo.widgets[widget]._paddingRight);count++;}
for(name in columnsWidget.columns)
{columnsWidget.columns[name].saveColumnWidth(columnsWidget.columns[name].width);columnsWidget.columns[name].reset();}}},undoColumnEmptyRemoveColumns:function(params,isUndo)
{var previousParent=params.previousParent,movingWidgetAfter=params.movingWidgetAfter,previousParentOfMovingWidget=params.previousParentOfMovingWidget,columnsWidget=params.columnsWidget,columnsWidgetEl=params.columnsWidgetEl,newColumn=params.newColumn,otherColumn=params.otherColumn,widgetBeforeStates=params.widgetBeforeStates,widgetAfterStates=params.widgetAfterStates,deletedWidget=params.deletedWidget,movedWidget=params.movedWidget,movedWidgetBeforeName=params.movedWidgetBeforeName,movedWidgetAfterName=params.movedWidgetAfterName,idsAfterMove=params.idsAfterMove,namesAfterMove=params.namesAfterMove,idsBeforeMove=params.idsBeforeMove,namesBeforeMove=params.namesBeforeMove,nextWidgetID=params.nextWidgetID;var id=null,name=null,pop=null,moveWidget=null,widgetPaddingBefore=null,widgetPaddingAfter=null,count=0,i=0,countColumnsArgs=null,widgetColumnPosition=null,numberOfColumn=null,siblingColumn=null;if(isUndo==true)
{BaseKit.Editor.restoreWidget(previousParent,columnsWidget,nextWidgetID,columnsWidgetEl,BaseKit.UndoManager.getUndoPointer(),true);if(movedWidget!=null)
{newColumn.moveWidget(movedWidget.id,null,null,true,false,true,movedWidgetBeforeName);}
else
{BaseKit.Editor.restoreWidget(newColumn,deletedWidget,null,deletedWidget.$(),BaseKit.UndoManager.getUndoPointer());}
pop=null;for(i=0;i<idsAfterMove.length;i++)
{id=idsAfterMove[i];name=namesBeforeMove[i];pop=widgetBeforeStates[i];widgetPaddingBefore=pop.columnsWidgetPaddingBefore;moveWidget=$bk(id);otherColumn.moveWidget(moveWidget.id,null,null,true,false,true,name);var usePixels=(typeof moveWidget._usePixels!="undefined"&&moveWidget._usePixels);var rightMarginInPixels=usePixels?widgetPaddingBefore.right:Math.floor((otherColumn.$().width()/100)*widgetPaddingBefore.right);var leftMarginInPixels=usePixels?widgetPaddingBefore.left:Math.floor((otherColumn.$().width()/100)*widgetPaddingBefore.left);moveWidget.setRegion(leftMarginInPixels,parseInt(widgetPaddingBefore.top),rightMarginInPixels,parseInt(widgetPaddingBefore.bottom),null,null,['left','right','top','bottom'],false);moveWidget.savePadding(moveWidget._paddingLeft,moveWidget._paddingRight);}}
else
{if(movedWidget!=null)
{previousParentOfMovingWidget.moveWidget(movedWidget.id,(movingWidgetAfter!=null?movingWidgetAfter.id:null),null,true,false,true,movedWidgetAfterName);}
else
{BaseKit.Editor.destroyWidget(deletedWidget,true);}
pop=null,count=0;for(i=0;i<idsBeforeMove.length;i++)
{id=idsBeforeMove[i];name=namesAfterMove[i];pop=widgetAfterStates[count];widgetPaddingAfter=pop.columnsWidgetPaddingAfter;moveWidget=$bk(id);previousParent.moveWidget(moveWidget.id,nextWidgetID,null,true,false,true,name);var usePixels=(typeof moveWidget._usePixels!="undefined"&&moveWidget._usePixels);var rightMarginInPixels=usePixels?widgetPaddingAfter.right:Math.floor((otherColumn.$().width()/100)*widgetPaddingAfter.right);var leftMarginInPixels=usePixels?widgetPaddingAfter.left:Math.floor((otherColumn.$().width()/100)*widgetPaddingAfter.left);moveWidget.setRegion(leftMarginInPixels,parseInt(widgetPaddingAfter.top),rightMarginInPixels,parseInt(widgetPaddingAfter.bottom),null,null,['left','right','top','bottom'],false);moveWidget.savePadding(moveWidget._paddingLeft,moveWidget._paddingRight);count++;}
BaseKit.Editor.destroyWidget(columnsWidget,true,false);}},resizeHighlightShow:function()
{if(this.highlight!=null)
{this.highlight.show();}},resizeHighlightHide:function()
{if(this.highlight!=null)
{this.highlight.hide();}},numberOfColumns:function()
{var columns=0;for(var name in this.columns)
{++columns;}
return columns;},onMoveFinish:function()
{this.callParent.apply(this,arguments);var clearElement=this.$("clear");clearElement.attr('id',this.makeID('clear'));this.dispatch('onMoveFinish');}}});})();(function()
{var sidebarWidth=0;var parentColumn=null
var __self=null;function closeColumnSettings()
{$('#page-primary__editorBKcolumnsettings').hide();$('#page-primary__editor').unbind('mousedown',closeColumnSettings);}
BaseKit.Widget_Columns_Column=BaseKit.Class.create({superclass:BaseKit.Framework_Control_Zone,globals:{hide:function()
{if(__self!==null)
{__self.hideColumnSettings();}}},editor:{construct:function()
{this.callParent.apply(this,arguments);var that=__self=this;this.resizer=null;var timeout=setTimeout(function()
{clearTimeout(timeout);if(!(BaseKit.Framework_Page.isMode(['normal'])))
{that.getRoot().primary['editor'].handleEvent('columnStyleTypeChange',that,'checkTypeChange');that.getRoot().primary['editor'].handleEvent('columnStyleUpdated',that,'styleUpdated');}},100);},attach:function(stopExitPreviewMode)
{this.callParent.apply(this,arguments);var that=this;if(stopExitPreviewMode!==true)
{stopExitPreviewMode=false;}
if((BaseKit.Framework_Page.isMode(['normal'])))
{return;}
if(this.parent.topLevel===true)
{var page=$bk("page");this.$().mouseover(function()
{if(page.advancedMode&&(that.parent.privateWidgets||that.parent.numberOfColumns()>1))
{that.showSettings();}});this.$().mouseout(function()
{that.hideSettings();});var settings=$('<div></div>').addClass('widget-columns-column-settings-bar prevent-select hidden').appendTo(this.$('padding'));var icons=$('<div></div>').addClass('widget-columns-column-icons').appendTo(settings);var buffer=$('<div></div>').addClass('widget-columns-column-buffer').appendTo(settings);var editMessage=this.getRoot().t("edit-settings-title");this.edit=$('<div></div>').addClass('widget-columns-column-icon widget-columns-column-edit').attr('title',editMessage);this.edit.mousedown(function(event)
{BaseKit.Editor.hideAllPopups();BaseKit.Editor.selectWidget(that);var widget=BaseKit.Editor.getSelectedWidget();if(widget!==null&&that.id==widget.id)
{var settings=$('#page-primary__editorBKcolumnsettings');var el=$(this);var region=el.getRegion();var columnSettings=BaseKit.Editor.get().controls['columnSettings'];$('#page-primary__editorBKrowsettings').hide();settings.show();settings.css('top',(region.top+20)+'px');settings.css('left',(parseInt(region.left-settings.width())+20)+'px');if(settings.right>$(document).width())
{var columnSettingsRegion=columnSettings.$().getRegion();settings.css('left',(columnSettingsRegion.left-settings.width())+'px');}
var settingsRegion=settings.getRegion();var editorRegion=BaseKit.Editor.get().$().getRegion();var settingsHeight=settings.height();if(settingsRegion==null||editorRegion==null)
{return;}
if(settingsRegion.bottom>editorRegion.bottom)
{settings.css('top',(region.top+15-settingsHeight)+'px');settings.addClass('bk-up');}
columnSettings.showPopup();event.stopPropagation();event.preventDefault();$('#page-primary__editor').bind('mousedown',[this],closeColumnSettings);}
$('.framework-control-columnstyle-selector-list-holder').scrollbar({arrows:false});});icons.append(this.edit);}
this.reset();},detach:function()
{this.callParent.apply(this,arguments);},isEmpty:function()
{for(var widget in this.widgets)
{return false;}
return true;},countWidgets:function()
{var count=0;for(var widget in this.widgets)
{count++}
return count;},reset:function()
{this.callParent.apply(this,arguments);if(BaseKit.Framework_Page.isMode(["edit","preview",'themeselector','admin']))
{sidebarWidth=parseInt(BaseKit.Editor.get().controls.sidebar.$().width());if(this.resizer==null)
{this.resizer=$('<div></div>').addClass('widget-columns-column-resize prevent-select');var that=this,totalWidth=0,columnRegion=null,otherRegion=null,parentRegion=null,parentWidth=0,theOther=null,delta=0,column1WidthPre,column2WidthPre,column1WidthPost,column2WidthPost,resizerLeftPre,resizerLeftPost;var leftGutter,rightGutter;var snaps=[];var page=$bk("page");this.resizer.addPlugin("drag",{custom:true,clone:false,onDragStart:function(drag,x,y,event)
{var parent=that.parent,columns=parent.columns,next=false;BaseKit.Editor.selectWidget(null);var check=null;if(BaseKit.Browser.ie7&&parent!=null)
{check=parent;while(check!=null&&!(check instanceof BaseKit.Framework_Page))
{if(check instanceof BaseKit.Framework_Control_Slice_Column)
{parentColumn=check;}
check=check.parent;}
check=null;}
for(var name in columns)
{var column=columns[name];if(next)
{theOther=column;break;}
if(name==that.__name)
{next=true;}}
column1WidthPre=that.width;column2WidthPre=theOther.width;resizerLeftPre=that.resizer.css("left");columnRegion=that.$().getRegion(false,true);otherRegion=theOther.$().getRegion(false,true);parentRegion=parent.$("content").getRegion(false,true);parentWidth=parentRegion.right-parentRegion.left
that.parent.resizeHighlightShow();$('.widget-columns-column-resize').each(function(index,element)
{var el=$(element);if(el.parent().parent().attr('id')!=that.parent.id&&el.isVisible())
{el.addClass('resize-hidden');}});totalWidth=(parseFloat(that.width)+parseFloat(theOther.width)).toFixed(10);leftGutter=Math.floor(that.parent.gutterWidth/2);rightGutter=that.parent.gutterWidth-leftGutter;;delta=columnRegion.right-x-(that.first?0:rightGutter);snaps=[];var guides=BaseKit.Editor.getGuides(),row=$(".control-row-content").filter(":visible").first(),offset=row.offset(),width=row.width();$.each(guides,function(i,guide)
{snaps.push((guide.data("position")*width)-columnRegion.left+offset.left-1);});BaseKit.Framework_Page.startDoing('column-drag');},onDragMove:function(drag,x,y)
{var width=Math.min(Math.max(x-columnRegion.left+delta,leftGutter)+(that.first?0:leftGutter),otherRegion.right-columnRegion.left-(theOther.last?rightGutter:(leftGutter+rightGutter)));if(page.showingGuides)
{for(var i=0,j=snaps.length;i<j;++i)
{var snap=snaps[i];if(width>(snap-8)&&width<(snap+8))
{BaseKit.Editor.showVerticalGuide('left',(snap+columnRegion.left-sidebarWidth)+"px");width=snap+1;break;}
else
{BaseKit.Editor.hideVerticalGuide();}}}
var widthPercent=parseFloat((100*width/parentWidth).toFixed(10));var otherWidth=parseFloat((totalWidth-widthPercent).toFixed(10));that.width=widthPercent;that.$().css("width",widthPercent+"%");theOther.width=otherWidth;theOther.$().css("width",otherWidth+"%");that.resizer.css("left",(columnRegion.left+width-parentRegion.left-leftGutter)+"px");that.parent.onResize();if(BaseKit.Browser.ie7&&typeof parentColumn=='object'&&parentColumn instanceof BaseKit.Framework_Control_Slice_Column)
{parentColumn.onResize();}},onDragFinish:function()
{that.parent.resizeHighlightHide();$('.resize-hidden').each(function(index,element)
{$(element).removeClass('resize-hidden');});BaseKit.Editor.hideVerticalGuide();that.parent.save();BaseKit.Framework_Page.finishDoing("column-drag");if(!that.parent.topLevel)
{BaseKit.Editor.selectWidget(that.parent);}
column1WidthPost=that.width;column2WidthPost=theOther.width;resizerLeftPost=that.resizer.css("left");BaseKit.UndoManager.pushUndoState("columnResize",{column1Object:that,column2Object:theOther,column1WidthPre:column1WidthPre,column2WidthPre:column2WidthPre,column1WidthPost:column1WidthPost,column2WidthPost:column2WidthPost,resizerLeftPre:resizerLeftPre,resizerLeftPost:resizerLeftPost});}});this.addResizer();if(this.last===true||BaseKit.Framework_Page.isMode(["preview","themeselector"]))
{this.resizer.hide();}}
else
{if(this.last===true||BaseKit.Framework_Page.isMode(["preview","themeselector"]))
{this.resizer.hide();}
else
{var leftGutter=Math.floor(this.parent.gutterWidth/2),rightGutter=this.parent.gutterWidth-leftGutter;;var columnRegion=this.$().getRegion(false,true),parentRegion=this.parent.$("content").getRegion(false,true);if(columnRegion==null||parentRegion==null)
{return;}
this.resizer.css("left",(columnRegion.right-parentRegion.left-leftGutter)+"px");this.resizer.css("width",(this.parent.gutterWidth-2)+"px");this.resizer.show();}}}},destroy:function()
{this.removeResizer();this.clearJQCache();if(this.parent!=null&&this.parent!='undefined')
{this.callParent.apply(this,arguments);}},getContentEl:function()
{return this.$("padding");},onResize:function()
{this.$().css("width",this.width+"%");this.resizeWidgets();},addResizer:function()
{var resizer=this.resizer;var leftGutter=Math.floor(this.parent.gutterWidth/2),rightGutter=this.parent.gutterWidth-leftGutter;;var columnRegion=this.$().getRegion(false,true),parentRegion=this.parent.$("content").getRegion(false,true);this.parent.$("content").append(resizer);if(columnRegion!==null)
{try
{resizer.css("left",(columnRegion.right-parentRegion.left-leftGutter)+"px");resizer.css("width",(this.parent.gutterWidth-2)+"px");}
catch(e){}}},removeResizer:function()
{var root=this.$();try
{this.resizer.hide();}
catch(e){}},onEnterPreviewMode:function()
{this.callParent.apply(this,arguments);this.removeResizer();},onExitPreviewMode:function()
{this.callParent.apply(this,arguments);if(this.last===true||BaseKit.Framework_Page.isMode(["preview",'themeselector']))
{this.resizer.hide();}
else
{this.resizer.show();}},showSettings:function()
{this.hideSettings();var page=$bk("page");if(!page.advancedMode||(!this.parent.privateWidgets&&this.parent.numberOfColumns()==1))
{return;}
if(BaseKit.Framework_Page.isDoing('drag')||$('#page-primary__editorBKcolumnsettings').isVisible()||BaseKit.Framework_Page.isMode(['preview','themeselector']))
{return;}
var settings=this.$('settings-bar');settings.show();this.$('drag-vertical').show();},hideSettings:function()
{if(BaseKit.Framework_Page.isDoing('drag')||$('#page-primary__editorBKcolumnsettings').isVisible())
{return;}
this.$('settings-bar').hide();this.$('drag-vertical').hide();},applyColumnStyle:function(styleName,save,type,minusBorderMargin)
{this.clearJQCache();if(this.styleName!='')
{this.$('padding').removeClass('column-'+this.styleName);}
this.$('padding').addClass('column-'+styleName);this.styleName=styleName;if(type!=null)
{this.changeType('outer',type);}
if(minusBorderMargin!==null||minusBorderMargin!==undefined)
{this.minusBorderMargin=parseInt(minusBorderMargin);this.saveMinusBorderMargin(parseInt(minusBorderMargin));}
if(save==true)
{this.saveStyleName(styleName);}
this.parent.onResize();closeColumnSettings();},checkTypeChange:function(level,type,styleName)
{if(this.styleName==styleName&&type!=this.type)
{this.changeType(level,type);}},changeType:function(level,type)
{var validTypes=['color','flex','image','linear'];if(!validTypes.contains(type))
{return;}
this.type=type;this.saveType(type);switch(type)
{case'color':case'image':case'linear':this.setColumnToRepeatType();break;case'flex':this.setColumnToFlexType();break;}},setColumnToRepeatType:function()
{this.clearJQCache();this.$('column-top').remove();this.$('column-middle').remove();this.$('column-bottom').remove();},setColumnToFlexType:function()
{this.setColumnToRepeatType();this.$('padding').prepend($('<div></div>').addClass('column-flex-bottom '+this.makeClass('column-bottom')));this.$('padding').prepend($('<div></div>').addClass('column-flex-middle '+this.makeClass('column-middle')));this.$('padding').prepend($('<div></div>').addClass('column-flex-top '+this.makeClass('column-top')));},removeStyle:function()
{this.hideColumnSettings();if(this.styleName!='')
{this.$('padding').removeClass('column-'+this.styleName);this.styleName='';}
this.type='color';this.setColumnToRepeatType();this.minusBorderMargin=0;this.removeStylePHP();},styleUpdated:function(styleName,minusBorderMargin)
{if(this.parent.parent instanceof BaseKit.Framework_Control_Row&&this.styleName==styleName)
{var row=this.parent.parent
this.minusBorderMargin=parseInt(minusBorderMargin)>0?minusBorderMargin:0;this.saveMinusBorderMargin(this.minusBorderMargin)
var minHeight=row.minHeight;this.$('padding').css('minHeight',Math.max((parseInt(minHeight)-parseInt(this.minusBorderMargin)),0)+'px');}},hideColumnSettings:function()
{closeColumnSettings();this.hideSettings();},showFooter:function(ref,name,forceUpdateCSS)
{if(ref<=0&&name==null)
{return;}
var editor=BaseKit.Editor.get(),that=this;BaseKit.Framework_Control_TabPanel.loadTabs(this._tabs);var style={'ref':ref,'styleName':name,'widgetID':that.id,'forceUpdateCSS':(forceUpdateCSS!==null&&forceUpdateCSS!==undefined)?forceUpdateCSS:false};editor.showFooter();BaseKit.Framework_Control_TabPanel.changeTabByName('columnstyleeditor',style);},onMoveFinish:function()
{this.callParent.apply(this,arguments);var clearElement=this.$("clear");clearElement.attr('id',this.makeID('clear'));this.dispatch('onMoveFinish');}},methods:{onShow:function()
{var widgets=this.widgets;for(var name in widgets)
{var widget=widgets[name];if(typeof widget.onShow=="function")
{widget.onShow();}}}}});})();(function()
{var timeout=null;var sizer=null;function attachOnClick(event,scope)
{var that=this;if(event&&event!==null)
{BaseKit.DragDrop.cancelDrag(event);event.stop();}
if(scope!=null&&scope.plugin!=null&&scope.plugin.isActive()==false)
{scope.plugin.start();scope.setIsEditing(true);BaseKit.Editor_Footer_HTMLEditor.forceUpdateHTML();}}
BaseKit.Widget_Content=BaseKit.Class.create({superclass:BaseKit.Framework_Widget,editor:{editorAttach:function()
{var that=this;this.setIsEditing(false);if(BaseKit.Framework_Page.isMode(['edit','preview','themeselector','admin']))
{this.$("edit").setup({plugins:{wysiwyg:{widgetID:that.id,className:this["class"],onFinish:function(html)
{that.onEditFinish(html);},onUpdateUI:function()
{that.onUpdateUI();},onChange:function(html)
{that.onChange(html);},baseURL:that.baseURL,delay:500,styles:that.getRoot().contentWidgetStyles}}});this.plugin=this.$("edit").getPlugin('wysiwyg');this.$().setup({interact:'image',plugins:{drop:{onDragStart:function(event)
{if(event&&that.isEditing())
{if(!that.$('image-grabber').isVisible())
{that.$('image-grabber').show();}}},onDragFinish:function()
{if(that.$('image-grabber').isVisible())
{that.$('image-grabber').hide();}}}}});}},queryCommandEnabled:function(command)
{return true;},queryCommandValue:function(command)
{return BaseKit.Element.Plugin.Wysiwyg.queryCommandValue(command)||'';},execCommand:function(command,value)
{return BaseKit.Element.Plugin.Wysiwyg.execCommand(command,value);},swatchChanged:function(swatch)
{if(swatch!==undefined)
{var map=BaseKit.Framework_Control_Theme.GetColorSwatchMap(swatch),hex=BaseKit.Framework_Control_Theme.GetGradientOffsetFromColorSwatchRef(swatch,map,true);this.execCommand('foreColor',hex);}},ieExecCommand:function(command,value)
{try
{var range=BaseKit.Editor.getRange();if(!['OpenLinkEditor'].contains(command))
{range.select();BaseKit.Editor.clearRange();}
if(command=='OpenLinkEditor')
{var link='',rel='',htmlText=range.htmlText;var matches=htmlText.match(/\href=["|'](http.*?)["|']/i);if(matches!=null&&matches[1]!=undefined)
{link=matches[1];}
var targetMatch=htmlText.match(/rel=["|']?(_blank|_self|_parent|_top)["|']?/i);if(targetMatch!=null&&targetMatch[1]!=undefined)
{rel=targetMatch[1];}
var parameters={'link':link.replace(this.baseURL,''),'rel':rel};this.openLinkEditor(parameters);return;}
else if(command=='CreateLink')
{value=(value.link!=null||value.link!=undefined)?value.link:'';}
else if(command=="SetStyle")
{if(typeof value=='object')
{command='InsertHTML';value='<'+value.tag+(value.class_name?' class="'+value.class_name+'"':'')+'>'+range.htmlText+'</'+value.tag+'>';range.pasteHTML(value);}
return;}
else if(command=="InsertHTML")
{if(range.offsetLeft==0)
{this.$('edit').focus();range=document.selection.createRange();}
range.pasteHTML(value);return;}
document.execCommand(command,false,value?value:null);}
catch(Exception)
{}},onEditFinish:function(html)
{if(html!=this.html)
{var that=this;BaseKit.UndoManager.pushUndoState("custom",{widget:that,callback:function(undo,data)
{if(undo)
{if(html!=that.originalContent)
{that.updateContent(that.originalContent);}}
else
{if(html!=that.originalContent)
{that.updateContent(html);}}}});if(html=='<p><br></p>')
{var editor=BaseKit.Editor.get(),toolbar=editor.footers.panel1.controls.settings;toolbar.deleteWidget(true,this.id);}
else
{this.updateContent(html);}}},onDelete:function()
{this.callParent.apply(this,arguments);var editElement=this.$("edit");BaseKit.Element.Plugin.Wysiwyg.elements[editElement.attr('id')+'-body']=null
this.removeContentEditor();},removeContentEditor:function()
{try
{this.plugin.finish();this.plugin.destroyEditor();this.setIsEditing(false);var editElement=this.$("edit");editElement.detach("mousedown",attachOnClick,this,this);}
catch(exception){}},onMoveStart:function()
{this.callParent.apply(this,arguments);this.removeContentEditor();},onMoveFinish:function()
{this.callParent.apply(this,arguments);var editElement=this.$("edit");editElement.attr('id',this.makeID('edit'));},onSelect:function(lastWidget,event)
{if(event&&this.plugin!=null&&this.plugin.started)
{BaseKit.DragDrop.cancelDrag(event);}
this.callParent.apply(this,arguments);this.$("edit").attach("mousedown",attachOnClick,this,this);},onUnselect:function(nextWidget)
{this.callParent.apply(this,arguments);},onEnterEditMode:function()
{this.callParent.apply(this,arguments);attachOnClick(null,this);this.originalContent=this.content;},updateContent:function(html,updateEditor)
{if(updateEditor!==false)
{updateEditor=true;}
this.html=this.content=html;if(!BaseKit.Browser.ie)
{this.$("edit").html(html);}
if(updateEditor!==false&&this.plugin!=null&&this.plugin.isActive()==true&&typeof this.plugin.setContent=='function')
{return this.plugin.setContent(html);}
this.saveEdits(this.html);BaseKit.Core.strictAnchors();},sanitise:function()
{var re2=/id="bk-generate-([1-9]*)"/i;var text=this.$("edit").innerHTML;this.$("edit").html(text.replace(re2,''));},setIsEditing:function(state)
{this.editing=state;},isEditing:function()
{return this.editing;},onUpdateUI:function()
{var settings=this.getSettingsPanel();if(settings!==null)
{var editor=this.getRoot().primary['editor'].controls['miniEditor'];if(editor!==null)
{editor.fireEvent('update');}}},insertImage:function(name,image,width,height)
{if(image==null){return;}
this.execCommand('InsertHTML','<img src="'+image+'" alt="'+name+'" width="'+width+'" height="'+height+'" />');},getContents:function()
{if(this.plugin!=null&&this.plugin.isActive()==true&&typeof this.plugin.getContent=='function')
{return this.plugin.getContent();}
else
{return this.$('edit').html();}},refreshHTML:function(html)
{if(!BaseKit.Browser.ie)
{this.$("edit").html(html);}
if(this.plugin!=null&&this.plugin.isActive()==true&&typeof this.plugin.setContent=='function')
{return this.plugin.setContent(html);}
BaseKit.Core.strictAnchors();},onChange:function(html)
{var editor=this.getHTMLEditorPanel();if(editor&&typeof editor.updateHTML=='function')
{this.content=html;editor.updateHTML(html,500);}
if(this.content!==this.getContents())
{this.content=this.getContents();}},forceStart:function()
{if(this.plugin!=null&&this.plugin.isActive()==false)
{this.plugin.start();this.setIsEditing(true);}},isActive:function()
{if(this.plugin!=null&&this.plugin.isActive()==false)
{return this.plugin.isActive();}
return false;}},methods:{attach:function()
{this._autoHeight=true;this.callParent.apply(this,arguments);if(BaseKit.Framework_Page.isMode(['edit','preview','themeselector','admin']))
{this.callEditor('editorAttach');}
BaseKit.Core.strictAnchors();}}});})();(function()
{BaseKit.Widget_Form=BaseKit.Class.create({superclass:BaseKit.Framework_Form,editor:{editorAttach:function()
{if(BaseKit.Framework_Page.isMode(['edit','preview','themeselector','admin']))
{var that=this;this.$().setup({plugins:{animation:{type:"highlight"}}});this.$().click(function()
{that.onClick();});this.setupPlugins();if(this.$('move').length)
{this.$('options-layer').setup({interact:["class.formWidgetCreated"],data:{type:"class.formWidgetCreated",value:that.id,parent:that.parent},plugins:{drag:{lockX:true,clone:true,cloneParent:true,styles:{backgroundColor:'#fff',border:'1px dashed #666',opacity:0.7},onDragStart:function()
{that.$().css('visibility','hidden');},onDragFinish:function()
{that.$().css('visibility','visible');}}}});}
if(this.$('delete').length)
{this.$('delete').mousedown(function(event)
{that.deleteWidget();event.stopPropagation();event.preventDefault();});}
if(this.$('settings').length)
{this.$('settings').mousedown(function(event)
{that.showSettings();event.stopPropagation();event.preventDefault();});}}},setupPlugins:function()
{if(BaseKit.Framework_Page.isMode(['edit','preview','themeselector','admin']))
{var that=this;if(this.$("title").length&&this.$("subtitle").length)
{if(this.$("title").hasPlugin('edit'))
{this.$("title").removePlugin('edit');}
this.$("title").setup({plugins:{animation:{type:"highlight"},edit:{enabled:BaseKit.Framework_Page.isMode(['edit']),multiLine:true,onChange:function(text)
{that.$('title').html(text.strip_tags());that.title=text.strip_tags();},onFinish:function()
{that.syncToField(that.title,that.subtitle);},next:this.$("subtitle")}}});if(this.$("subtitle").hasPlugin('edit'))
{this.$("subtitle").removePlugin('edit');}
this.$("subtitle").setup({plugins:{animation:{type:"highlight"},edit:{enabled:BaseKit.Framework_Page.isMode(['edit']),multiLine:true,onChange:function(text)
{that.$('subtitle').html(text.strip_tags());that.subtitle=text.strip_tags();},onFinish:function()
{that.syncToField(that.title,that.subtitle);}}}});}}},deleteWidget:function()
{if(BaseKit.Framework_Page.isMode(['edit']))
{var editor=BaseKit.Editor.get(),toolbar=editor.footers.panel1.controls.settings;toolbar.deleteWidget(false,this.id);}},updateMeta:function()
{if(BaseKit.Framework_Page.isMode(['edit']))
{if(this.$("title").length&&this.title!=this.$("title").html())
{this.$("title").html(this.title);}
if(this.$("subtitle").length&&this.subtitle!=this.$("subtitle").html())
{this.$("subtitle").html(this.subtitle);}
if(this.$("required").length&&this.validationType!='none')
{this.$("required").show();}
else
{this.$("required").hide();}}}},methods:{attach:function()
{this.__autoHeight=true;this.__unselectable=true;this.callParent.apply(this,arguments);this.callEditor('editorAttach');},onClick:function()
{this.fireEvent("onClick");},highlight:function()
{},validateEvent:function(show,message)
{if(!this.$('validation-message').length)
{$('<div></div>').addClass('widget-form-validation '+this.makeClass('validation-message')).appendTo(this.$());}
if(show==false)
{this.$('validation-message').html(message);this.$().addClass('bk-validaton-error');}
else
{this.$('validation-message').html('');this.$().removeClass('bk-validaton-error');}},onEnterPreviewMode:function()
{this.callParent.apply(this,arguments);try
{this.$("title").getPlugin('edit').disable();this.$("subtitle").getPlugin('edit').disable();}
catch(e){}},onExitPreviewMode:function()
{this.callParent.apply(this,arguments);try
{this.$("title").getPlugin('edit').enable();this.$("subtitle").getPlugin('edit').enable();}
catch(e){}}}});})();(function()
{BaseKit.Widget_Form_Note=BaseKit.Class.create({superclass:BaseKit.Widget_Form,methods:{construct:function()
{this.callParent.apply(this,arguments);},reset:function(resetValue)
{if(resetValue==undefined){resetValue=true;}
if(resetValue)
{this.controls['control'].setValue('');}
this.validateEvent(true,'')}}});})();(function()
{BaseKit.Widget_Form_Text=BaseKit.Class.create({superclass:BaseKit.Widget_Form,methods:{construct:function()
{this.callParent.apply(this,arguments);},reset:function(resetValue)
{if(resetValue==undefined){resetValue=true;}
if(resetValue)
{this.controls['control'].setValue('');}
this.validateEvent(true,'')}}});})();(function()
{BaseKit.Widget_Formarea=BaseKit.Class.create({superclass:BaseKit.Framework_Widget,editor:{init:function()
{var that=this;this.tableRef=0;this.changingTitle=null;var title=this.$('title');if(title.length)
{title.setup({plugins:{edit:{onStart:function()
{that.changingTitle=that.title;},onChange:function(text)
{that.changingTitle=text;},onFinish:function()
{if(that.changingTitle==undefined||that.changingTitle==that.title)
{return;}
that.setFormTitle(that.changingTitle);}}}});}},errorFormExists:function(error)
{this.changingTitle=this.$('title').html(this.title);BaseKit.Logger.log(error,'growl');},onResize:function(event)
{this.callParent.apply(this,arguments);this.height=this._innerHeight;},showDatabase:function()
{if(this.tableRef>0)
{var editor=BaseKit.Editor.get(),database=editor.footers['panel1'].controls['database'];var spreadsheets=database.controls,spreadsheet=spreadsheets['spreadsheet'+this.tableRef];if(database!==undefined&&typeof spreadsheets['spreadsheet'+this.tableRef]!='object')
{database.build(this.tableRef);}
else
{database.showFocusSpreadsheet(spreadsheet.id,database.title[this.tableRef],database.description[this.tableRef]);}}},checkChildDelete:function()
{this.columns['column'].reset();},setJStableRef:function(ref)
{this.tableRef=ref;},setMetaData:function()
{this.$('title').html(this.title);}},methods:{construct:function()
{this.callParent.apply(this,arguments);this._autoHeight=true;this.columns['column']._highlight=true;this.callEditor('init');},attach:function()
{this.callParent.apply(this,arguments);var that=this;this.$('button').click(function()
{that.submit();});},updateSettings:function()
{var settings=this.getSettingsPanel();if(settings!=null)
{settings.title=this.title;settings.description=this.description;settings.internal=this.internalRedirect;settings.external=this.externalRedirect;settings.email=this.email;settings.buttonText=this.buttonText;settings.updateSettingsPanel();}}}});})();
