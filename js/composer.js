var SimpleObject={
    mainObj:null,
    mainDiv:null,
    extend:function(obj){
        var clone=$.extend(true,{},this);
        return $.extend(true,clone,obj);
    }
}
var panelButton=SimpleObject.extend({
    name:'',
    width:50,
    height:50,
    image:null,
    action:function(){
    },
    show:function(){
        this.mainDiv=$("<div>"+this.title+"</div>");
        this.mainDiv
            .css({
                "width":this.width+'px',
                "height":this.height+'px',
                'border':'1px solid'
            })
            .addClass('panel-button');
        this.mainObj.append(this.mainDiv);
        this.mainDiv.click(this.action);
    }
});
var Diagram=SimpleObject.extend({
    width:400,
    height:200,
    isChoosed:false,
    create:function(){
        var self=this;
        this.mainDiv=$("<div></div>");
        this.mainDiv
            .css({
                "width":this.width+'px',
                "height":this.height+'px'
            })
            .addClass('diagram')
            .click(function(){
                self.setChoosed();
            });
        this.mainObj.append(this.mainDiv);
        this.mainDiv.css({
            top:this.mainDiv.position().top+'px',
            left:this.mainDiv.position().left+'px'
        });
        this.mainDiv.css({position:'absolute'});
        console.log(this.mainDiv.position().left);
    },
    setChoosed:function(){
        var self=this;
        this.isChoosed=!this.isChoosed;
        if(this.isChoosed)
        {
            this.unChoosed();
            this.isChoosed=true;
            this.mainDiv
                .addClass('choosed')
                .resizable({
                    //grid: [ 20, 10 ],
                     handles: "ne, se, nw, sw",
                     classes:{
                        "ui-resizable-nw":"bullet bullet-up-left",
                        "ui-resizable-sw":"bullet bullet-down-left",
                        "ui-resizable-ne":"bullet bullet-up-right",
                        "ui-resizable-se":"bullet bullet-down-right"
                    },
                    resize:function(){
                        self.isChoosed=false;
                    }
                })
                .draggable({drag:function(){
                    self.isChoosed=false;
                }})
                .draggable("option", "disabled", false);
                this.showControls();
        }
        else
        {
            this.setUnChoose();
        }
    },
    setUnChoose:function(){
        console.log(1);
        this.isChoosed=false;
        this.mainDiv.removeClass('choosed')
        //this.mainDiv.draggable( "option", "disabled", true );
        $('.bullet',this.mainDiv).remove();
    },
    unChoosed:function(){
    },
    showControls:function(){
        var bullet=$('<div></div>');
        bullet.addClass('bullet');
        /*this.mainDiv.append(bullet.clone().addClass('bullet-up-left'));
        this.mainDiv.append(bullet.clone().addClass('bullet-down-left').css({'top':this.mainDiv.height()-2}));
        this.mainDiv.append(bullet.clone().addClass('bullet-up-left').css({'top':this.mainDiv.height()-2,'left':this.mainDiv.width()-2}));
        this.mainDiv.append(bullet.clone().addClass('bullet-down-left').css({'left':this.mainDiv.width()-2}));*/
        //$('.ui-resizable-sw',this.mainDiv).css({'bottom':'-2px'});
    }
});
var Composer = SimpleObject.extend({
    panelButtons:['create','delete'],
    left:0,
    top:0,
    width:0,
    height:0,
    panelDiv:null,
    buttons:[],
    diagramsList:[],
    init:function(obj){
        this.mainObj=obj;
        this.showMainWindow();
        this.showPanel();
    },
    initButtons:function(){
        var self=this;
        this.buttons=[
            panelButton.extend({
                mainObj:this.panelDiv,
                'name':'create',
                'title':'create',
                image:'create.png',
                action:function(){
                    self.createDiagram();
                }
            }),
            panelButton.extend({
                mainObj:this.panelDiv,
                'name':'edit',
                image:'create.png'
            }),
            panelButton.extend({
                mainObj:this.panelDiv,
                'name':'delete',
                'title':'delete',
                image:'create.png'
            })
        ]
    },
    createDiagram:function(){
        var self=this;
        var diagram=Diagram.extend({
            diagramsList:self.diagramsList,
            mainObj:this.mainDiv,
            unChoosed:function(){
                for(var i=0;i<self.diagramsList.length;i++)
                {
                    self.diagramsList[i].setUnChoose();
                }
            }
        });
        this.diagramsList.push(diagram);
        console.log(this.diagramsList);
        diagram.create();
    },
    showMainWindow:function(){
        this.mainDiv=$("<div></div>");
        this.mainDiv.css({
            "width":"70%",
            "height":"100%",
            "border":"1px solid",
            "float":"left",
            "overflow":'hidden'
        });
        $(this.mainObj).append(this.mainDiv);
    },
    showPanel:function(){
        this.panelDiv=$("<div></div>");
        this.panelDiv.css({
            'width':'20%',
            'height':'100%',
            'border':'1px solid',
            'float':'left'
        });
        $(this.mainObj).append(this.panelDiv);
        this.initButtons();
        this.showButtons(this.panelButtons);
    },
    getButton:function(buttonName){
        for(var i=0;i<this.buttons.length;i++)
        {
            var obj=this.buttons[i];
            if(buttonName===this.buttons[i].name)
            {
                return this.buttons[i];
            }
        }
        return null;
    },
    showButtons:function(buttonList){
        var self=this;
        $.each(buttonList,function(key,value){
            self.getButton(value).show();
        })
    }
});
$(document).ready(function(){
    var composer=Composer.extend();
    composer.init($('#composer'));
}
);