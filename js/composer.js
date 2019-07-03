const typeGraphics=[
    'line',
    'bar'
];
var SimpleObject={
    mainDiv:null,
    extend:function(obj){
        var clone=$.extend(true,{},this);
        return $.extend(true,clone,obj);
    }
}
var inputElement=SimpleObject.extend({
    change:function(){

    }
});
var ComboBox=inputElement.extend({
    values:[],
    value:null,
    name:'',
    init:function(name, values){
        var self=this;
        this.name=name;
        this.values=values;
        this.mainDiv=$('<select></select>');
        this.mainDiv
            .attr('name',this.name);
        $.each(this.values,function(key,value){
            self.mainDiv.append("<option value='"+key+"'>"+value+"</option>");
        });
        this.mainDiv.change(function(){
            self.value=this.value;
            self.change();
        });
    },
    show:function(){
        return this.mainDiv;
    }
});
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
//        this.mainObj.append(this.mainDiv);
        this.mainDiv.click(this.action);
        return this.mainDiv;
    }
});
var SettingPanel=SimpleObject.extend({
    type:1,
    obj:null,
    show:function(){
        this.mainDiv=$("<div></div>");
        this.mainDiv.append('Hello');
        switch(this.type)
        {
            case 1: this.mainDiv.append(this.diagramSetting());break;
        }
        return this.mainDiv;
    },
    save:function(){

    },
    diagramSetting:function(){
        var self=this;
        var combobox=Object.create(ComboBox);
        combobox.init('typeDiagram',typeGraphics);
        combobox.change=function(){
            self.obj.type=this.value*1;
            self.save();
        }
        this.mainDiv.append(combobox.show());
    }
});
var Diagram=SimpleObject.extend({
    type:1,
    width:400,
    height:200,
    isChoosed:false,
    editor:'#controlPanel',
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
//        this.mainObj.append(this.mainDiv);
        this.mainDiv.css({
            top:this.mainDiv.position().top+'px',
            left:this.mainDiv.position().left+'px'
        });
        this.mainDiv.css({position:'absolute'});
        this.showControlPanel();
        console.log(this.mainDiv.position().left);
        return this.mainDiv;
    },
    update:function(){

    },
    showControlPanel:function(){
        var self=this;
        var button=panelButton.extend({
            width:30,
            height:30,
            image:null,
            'name':'edit',
            'title':'edit',
            action:function(){
                self.editDiagram();
            }
        });
        var button2=panelButton.extend({
            width:30,
            height:30,
            image:null,
            'name':'show',
            'title':'show',
            action:function(){
                console.log(self);
            }
        });
        this.mainDiv.append(button.show());
        this.mainDiv.append(button2.show());

    },
    editDiagram:function(){
        var self=this;
        $(this.editor).html('');
        var setting=SettingPanel.extend({
            obj:this,
            save:function(){
                self.type=this.obj.type;
            }
        });
        $('#controlPanel').html(setting.show());
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
                    grid: [ 20, 20 ],
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
                .draggable({
                    grid: [ 20, 20 ],
                    drag:function(){
                        self.isChoosed=false;
                    }
                })
                .draggable("option", "disabled", false);
                this.showControls();
        }
        else
        {
            this.setUnChoose();
        }
    },
    setUnChoose:function(){
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
                'name':'create',
                'title':'create',
                image:'create.png',
                action:function(){
                    self.createDiagram();
                }
            }),
            panelButton.extend({
                'name':'edit',
                image:'create.png'
            }),
            panelButton.extend({
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
            unChoosed:function(){
                for(var i=0;i<self.diagramsList.length;i++)
                {
                    self.diagramsList[i].setUnChoose();
                }
            }
        });
        this.diagramsList.push(diagram);
        console.log(this.diagramsList);
        this.mainDiv.append(diagram.create());
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
        this.panelDiv=$("<div id='controlPanel'></div>");
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
            $('#buttons').append(self.getButton(value).show());
        })
    }
});
$(document).ready(function(){
    var composer=Composer.extend();
    composer.init($('#composer'));
}
);