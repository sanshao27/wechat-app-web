Bmob.initialize("你的Application ID", "你的REST API Key");
layui.use(['form', 'layedit', 'upload', 'laydate'], function() {
    if (localStorage.getItem("login_type") == '2') {
        var $ = layui.jquery;
        var layer = layui.layer;
        layer.msg('权限不足，无法编辑', { icon: 4 });
        $(':button').prop('disabled', true);
        $(':input').prop('disabled', true);
    } else {
        var $ = layui.jquery;
        var form = layui.form,
            layer = layui.layer,
            layedit = layui.layedit,
            upload = layui.upload;
        var tag_token = $(".tag_token").val();
        // var moneytype = $('input:radio[name="paytype"]:checked').val();
        var payType = '0';
        //自定义验证规则  
        form.verify({
            comptitle: function(value) {
                if (value.length == 0) {
                    return '公司名称不能为空';
                }
            },
            workcity: function(value) {
                if (value.length == 0) {
                    return '工作城市不能为空';
                }
            },

            price_max: function(value) {
                if (value.length == 0) {
                    return '工资范围不能为空';
                }
            },
            detsrc: function(value) {
                if (value.length == 0) {
                    return '图片地址不能为空';
                }
            },
            phone: [/^1[3|4|5|7|8]\d{9}$/, '手机必须11位，只能是数字！']
        });


        //监听radio单选
        form.on('radio(radio)', function(data) {
            //  console.log(data.value); //被点击的radio的value值
            if (data.value == 1) {
                $('#detPayMin').hide();
                $('#fw').hide();
                payType = '1';
                //   console.log('日结');
            } else {
                $('#detPayMin').show();
                $('#fw').show();
                payType = '0';
            }
        });
        //普通图片上传
        var uploadInst = upload.render({
            elem: '.btn_upload_img',
            type: 'images',
            exts: 'jpg|png|gif|jpeg' //设置一些后缀，用于演示前端验证和后端的验证
                //,auto:false //选择图片后是否直接上传
                //,accept:'images' //上传文件类型
                ,
            url: 'upload.php',
            data: {
                '_token': tag_token
            },
            before: function(obj) {
                //预读本地文件示例，不支持ie8
                obj.preview(function(index, file, result) {
                    $('.img-upload-view').attr('src', result); //图片链接（base64）
                });
            },
            done: function(res) {
                $('#detSrc').val("http://admin.xxsyywl.cn/" + res.data);
                //如果上传失败
                if (res.status == 1) {
                    return layer.msg('上传成功');

                } else { //上传成功
                    layer.msg(res.message);
                    // console.log(res.data);
                    //$('#detSrc').val("http://admin.xxsyywl.cn/" + res.data);

                }
            },
            error: function() {
                //演示失败状态，并实现重传
                return layer.msg('上传失败,请重新上传');
            }
        });
        //创建一个编辑器  
        layedit.build('LAY_demo_editor');

        //监听提交
        form.on('submit(demo1)', function(data) {
            // layer.alert(JSON.stringify(data.field.val), {
            //     title: '最终的提交信息'
            // })

            var DetailInfo = Bmob.Object.extend("DetailInfo");
            var DetailInfo = new DetailInfo();
            layer.msg('正在提交，请稍等', {
                time: 2000, //20s后自动关闭
                icon: 6,
            });
            DetailInfo.set("detName", $('#detName').val());
            DetailInfo.set("detAddr", $('#detAddr').val());
            DetailInfo.set("entNum", Number($('#entNum').val()));
            if (payType == 0) {
                DetailInfo.set("detPayMin", Number($('#detPayMin').val()));
            }
            DetailInfo.set("detPayMax", Number($('#detPayMax').val()));
            DetailInfo.set("payType", Number(payType));
            DetailInfo.set("payDescription", $('#payDescription').val().replace(/\n|\r\n/g, "<br/>"));
            DetailInfo.set("detCompany", $('#detCompany').val().replace(/\n|\r\n/g, "<br/>"));
            DetailInfo.set("boardDescription", $('#boardDescription').val().replace(/\n|\r\n/g, "<br/>"));
            DetailInfo.set("recruitDescription", $('#recruitDescription').val().replace(/\n|\r\n/g, "<br/>"));
            DetailInfo.set("kindlyReminder", $('#kindlyReminder').val().replace(/\n|\r\n/g, "<br/>"));
            DetailInfo.set("detSrc", $('#detSrc').val());
            DetailInfo.save(null, {
                success: function(object) {
                    //alert("create object success, object id:" + object.id);
                    layer.msg('上传成功,请勿重复提交数据', {
                        icon: 1,
                        time: 2000 //2秒关闭（如果不配置，默认是3秒）
                    }, function() {
                        //do something
                        //$(" input[ type='text' ] ").val('');
                        $("#myform").find("input,textarea").each(function() {
                            this.value = ""; //也可以清空数据this.value ="";
                        });
                        $('#detSrc').val("upimg/demo.png");
                    });
                },
                error: function(model, error) {
                    // alert("create object fail");
                    //  console.log("查询失败: " + error.code + " " + error.message);
                    layer.msg('上传失败,请稍后再试', {
                        icon: 2,
                        time: 2000 //2秒关闭（如果不配置，默认是3秒）
                    });

                }
            });
            return false;

        });

    }

});