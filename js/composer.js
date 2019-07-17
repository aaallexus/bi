const TYPE_GRAPHIC_LINE=1;
const TYPE_GRAPHIC_BAR=2;
const TYPE_GRAPHIC_PIE=3;
const TYPE_GRAPHIC_DOUGHNUT=4;
const TYPE_GRAPHICS=[''];
const SERVER_URL='server.php';
TYPE_GRAPHICS[TYPE_GRAPHIC_LINE]='line';
TYPE_GRAPHICS[TYPE_GRAPHIC_BAR]='bar';
TYPE_GRAPHICS[TYPE_GRAPHIC_PIE]='pie';
TYPE_GRAPHICS[TYPE_GRAPHIC_PIE]='doughnut';

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
    init:function(name, values,defaultValue){
        var self=this;
        this.name=name;
        this.values=values;
        this.mainDiv=$('<select></select>');
        this.mainDiv
            .attr('name',this.name);
        this.changeData(this.values);
        this.mainDiv.change(function(){
            self.value=this.value;
            self.change();
        });
        this.mainDiv.val(defaultValue);
    },
    changeData:function(data)
    {
        var self=this;
        $.each(data,function(key,value){
            self.mainDiv.append("<option value='"+key+"'>"+value+"</option>");
        });
    },
    show:function(){
        this.mainDiv.change(function(){
            self.value=this.value;
            self.change();
        })
        return this.mainDiv;
    }
});
var ComboBoxAjax=ComboBox.extend({
    combobox:null,
    init:function(name, dataRequest,defaultValue){
        var self=this;
        this.name=name;
        this.combobox=Object.create(ComboBox);
        self.combobox.init(name,[],0);
        $.ajax(dataRequest).done(function(param){
            var data=[''];
            for(let i=0;i<param.length;i++)
            {
                data[param[i].id]=param[i].name;
            }
            self.combobox.changeData(data);
            self.combobox.change=function(){
                //self.obj.type=this.value*1;
                //self.save();
            }
        });
        this.mainDiv=this.combobox.show();
    },
    change:function(){
        this.combobox.change();
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
        this.mainDiv.click(this.action);
        return this.mainDiv;
    }
});
var SettingPanel=SimpleObject.extend({
    type:1,
    obj:null,
    controls:[],
    create:function(){
        switch(this.type)
        {
            case 1: this.vidgetSetting();break;
        }
        //this.show();
        return this.show();
    },
    show:function(){
        console.log(11);
        var self=this;
        this.mainDiv=$("<div></div>");
        var obj1;
        for(let i=0;i<this.controls.length;i++)
        {   
            let obj1=self.controls[i].show();
            obj1.change(self.controls[i].change);
            this.mainDiv.append(obj1);
            //self.controls[i].change();
            console.log(this.controls[i]);
        }
        return this.mainDiv;
    },
    save:function(){
    },
    vidgetSetting:function(){
        var self=this;
        var combobox=Object.create(ComboBox);
        var comboboxDataSource=Object.create(ComboBoxAjax);
        combobox.init('typeVidget',TYPE_GRAPHICS,this.obj.type);
        combobox.change=function(){
            alert(7);
            self.obj.type=this.value*1;
            self.save();
        }
        comboboxDataSource.init('dataSource',{
            url:'server.php',
            dataType:'json',
            method:'POST',
            data:{
                action:'getDataSource'
            }
        });
        this.controls.push(combobox);
        this.controls.push(comboboxDataSource);
        //this.mainDiv.append(combobox.show());
        //this.mainDiv.append(comboboxDataSource.show());
    }
});
var Vidget=SimpleObject.extend({
    type:0,
    width:400,
    height:200,
    isChoosed:false,
    editor:'#controlPanel',
    settingObj:null,
    create:function(){
        var self=this;
        this.mainDiv=$("<div></div>");
        this.mainDiv
            .css({
                "width":this.width+'px',
                "height":this.height+'px'
            })
            .addClass('vidget')
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
        this.mainDiv.append('<div id="title"></div>');
        console.log(this.mainDiv.position().left);
        this.afterCreate();
        this.update();
        return this.mainDiv;
    },
    afterCreate:function(){
    },
    update:function(){
        $('#title',this.mainDiv).text(this.type);
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
                self.editVidget();
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
       // this.mainDiv.append(button.show());
        //this.mainDiv.append(button2.show());

    },
    editVidget:function(){
        var self=this;
        $(this.editor).html('');
        if(this.settingObj===null)
        {
            this.settingObj=SettingPanel.extend({
                obj:this,
                save:function(){
                    self.type=this.obj.type;
                    self.update();
                }
            });
            $('#controlPanel').html(this.settingObj.create());
        }
        else
            $('#controlPanel').html(this.settingObj.show()); 
    },
    setChoosed:function(){
        var self=this;
        this.isChoosed=!this.isChoosed;
        if(this.isChoosed)
        {
            this.unChoosed();
            this.isChoosed=true;
            this.editVidget();
            this.mainDiv
                .addClass('choosed')
                .resizable({
                    minHeight:100,
                    minWidth:200,
                    grid: [ 20, 20 ],
                    handles: "ne, se, nw, sw",
                     classes:{
                        "ui-resizable-nw":"bullet bullet-up-left",
                        "ui-resizable-sw":"bullet bullet-down-left",
                        "ui-resizable-ne":"bullet bullet-up-right",
                        "ui-resizable-se":"bullet bullet-down-right"
                    },
                    resize:function(event,ui){
                        self.isChoosed=false;
                        self.width=ui.size.width;
                        self.height=ui.size.height;
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
var ChartVidget=Vidget.extend({
    chartObj:null,
    update:function(){
        $('#title',this.mainDiv).text(this.type);
        if(this.type>0)
        {
            if(this.chartObj===null)
            {
                this.chartObj= new Chart($('#chart',this.mainDiv)[0].getContext('2d'),{
                    type: TYPE_GRAPHICS[this.type],
                    data: {
                        labels: [1,2,3,4,5],
                        datasets: [{
                            "label": this.title,
                            data: [4,2,76,5,3],
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(255, 159, 64, 0.2)'
                            ],
                            borderColor: 'rgba(255, 99, 132, 1)',
                            pointBorderColor:'rgba(150, 150, 150, 1)',
                            borderWidth: 3,
                            fill:false,
                            lineTension:0
                        }]
                    },
                    options: {
                        responsive:true,
                        maintainAspectRatio:false,
                        //aspectRatio:this.width/this.height
                    }
                });
            }else{
                console.log(this.chartObj,this.height,this.width);
                this.chartObj.config.type=TYPE_GRAPHICS[this.type];
                //this.chartObj.options.aspectRatio=this.width/this.height;
                //this.chartObj.canvas.parentNode.style.height = '700px';
                this.chartObj.update();
                //this.chartObj.render();
                //this.chartObj.resize();
            }
        }
    },
    afterCreate:function(){
        this.mainDiv.append('<canvas id="chart"></canvas>');
    }
})
var Composer = SimpleObject.extend({
    panelButtons:['create','delete'],
    left:0,
    top:0,
    width:0,
    height:0,
    panelDiv:null,
    buttons:[],
    vidgetsList:[],
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
                    self.createVidget();
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
    createVidget:function(){
        var self=this;
        console.log(ChartVidget);
        var chart=ChartVidget.extend({
            vidgetsList:self.vidgetsList,
            unChoosed:function(){
                for(var i=0;i<self.vidgetsList.length;i++)
                {
                    self.vidgetsList[i].setUnChoose();
                }
            }
        });
        this.vidgetsList.push(chart);
        this.mainDiv.append(chart.create());
        chart.setChoosed();
    },
    showMainWindow:function(){
        this.mainDiv=$("<div></div>");
        this.mainDiv.css({
            "width":"70%",
            "height":"130%",
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
            'height':'130%',
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