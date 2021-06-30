# IoTServer

**物联网应用管理网站**

![校标](README.assets/校标-1624949871604.png)

- 课程名称：B/S 体系软件设计
- 姓名：徐震
- 学院：竺可桢学院
- 专业：混合班（计算机科学与技术）
- 学号：3180105504
- 指导老师：胡晓军



项目地址：

- 前端：https://github.com/dendenxu/iotserver-front

- 后端：https://github.com/dendenxu/iotserver

- IoT设备模拟器：https://github.com/dendenxu/iotclient

    （添加了lastwill与connect消息等客制化功能）

- 预览地址：https://neon-cubes.xyz:5001/



2021年5月6日

## IoTServer使用手册与功能测试

我们的项目包括了前端、后端以及IoT设备模拟器等多类别的客制化内容，为了描述方便，我们将在后续手册中用`iotserver`来称呼项目后端源码根目录，`iotserver-front`代指前端，`iotclient`代指IoT设备模拟器



### 使用环境

由于我们使用`spring-boot`和`java`进行了后端开发，并以`React`为框架进行了前端开发，本项目可在不同系统上正常运行，作者详细测试了

- ***Ubuntu***或***CentOS***的linux发行版上的使用，开发情况
- ***Windows 10***外加***Docker***上的使用，开发情况

我们将主要以Ubuntu为例介绍各项依赖的安装

#### 数据库

项目使用***MongoDB***作为主要数据库

- 请参考[MongoDB的官方安装指导](https://docs.mongodb.com/manual/installation/)安装MongoDB，在不同Linux发行版上与Windows上这一步基本都是相同的

    我们希望您将MongoDB开放在默认的27017端口下，并不要设置身份验证，否则后续的数据库填充脚本将无法正常工作

- 安装完成并验证MongoDB可以正常运行后，请运行`iotserver`根目录下的`iotserver/populate_db.sh`来加载我们预先提供的样例数据

- 若加载失败，请检查报错信息

    若您的MongoDB开放在不同的端口上，或者使用了身份验证机制，请根据[mongorestore的官方使用手册](https://docs.mongodb.com/database-tools/mongorestore/)修改`iotserver/populate_db.sh`中的

    ```bash
    ...
    INDEX_IOTSERVER=$(mongo --quiet --eval "db.getMongo().getDBNames().indexOf('iotserver');");
    ...
    mongorestore "${DB_FILE_BASE}";
    ...
    ```

- 加载完成后，您应该看到相应的成功提示，并能够在MongoDB的iotserver数据库中看到一些样例数据

    例如，执行下列指令后您应该可以看到一些结果

    ```bash
    mongo iotserver --eval "db.ioTMessage.find({mqttId: 'device0000'}).sort( { date: -1 } ).limit(5)"
    ```

    ```json
    { "_id" : ObjectId("60dacef6f04f5051342e03ad"), "mqttId" : "device0000", "email" : "3180105504@zju.edu.cn", "info" : "Device Data 2021/06/29 15:42:46", "value" : 13, "alert" : 0, "lng" : 120.33758344650269, "lat" : 30.33182578086853, "date" : ISODate("2021-06-29T07:42:46.784Z"), "_class" : "com.neoncubes.iotserver.IoTMessage" }
    { "_id" : ObjectId("60daceeef04f5051342e03a7"), "mqttId" : "device0000", "email" : "3180105504@zju.edu.cn", "info" : "Device Data 2021/06/29 15:42:38", "value" : 6, "alert" : 0, "lng" : 120.22832480669022, "lat" : 30.109348726272586, "date" : ISODate("2021-06-29T07:42:38.189Z"), "_class" : "com.neoncubes.iotserver.IoTMessage" }
    { "_id" : ObjectId("60dacee9f04f5051342e03a1"), "mqttId" : "device0000", "email" : "3180105504@zju.edu.cn", "info" : "Device Data 2021/06/29 15:42:33", "value" : 27, "alert" : 0, "lng" : 120.09050310850144, "lat" : 30.26041557788849, "date" : ISODate("2021-06-29T07:42:33.187Z"), "_class" : "com.neoncubes.iotserver.IoTMessage" }
    { "_id" : ObjectId("60dacee7f04f5051342e03a0"), "mqttId" : "device0000", "email" : "3180105504@zju.edu.cn", "info" : "Device Data 2021/06/29 15:42:31", "value" : 88, "alert" : 1, "lng" : 120.48855912685394, "lat" : 30.421336603164676, "date" : ISODate("2021-06-29T07:42:31.875Z"), "_class" : "com.neoncubes.iotserver.IoTMessage" }
    { "_id" : ObjectId("60dacedff04f5051342e0397"), "mqttId" : "device0000", "email" : "3180105504@zju.edu.cn", "info" : "Device Data 2021/06/29 15:42:23", "value" : 19, "alert" : 0, "lng" : 120.262087059021, "lat" : 30.459150576591494, "date" : ISODate("2021-06-29T07:42:23.431Z"), "_class" : "com.neoncubes.iotserver.IoTMessage" }
    ```

#### 数据结构服务器

项目使用***Redis***作为In-Memory Data Store提高某些操作的响应速度

- 请参考[Redis的官方安装指导手册](https://redis.io/download)安装Redis

- Windows用户方面稍为麻烦，我们推荐使用Docker创建Redis的运行环境，请参考[Docker的官方指导](https://hub.docker.com/_/redis/)进行相关配置，若连接遇到问题请参考[这篇文章](https://koukia.ca/installing-redis-on-windows-using-docker-containers-7737d2ebc25e)

- 安装完成后您可以通过`sudo systemctl start redis`等方式启动它（各类发行版的具体指令不同）

- 启动成功您应该可以通过如下指令连接到redis

    ```bash
    redis-cli
    # 您应该看到
    # 127.0.0.1:6379> 
    ```

#### Mqtt Broker

项目开发过程中使用***Eclipse Mosquitto***作为Mqtt Broker用以进行IoT客户端与后端服务器的交互

因此我们需要在运行环境下安装该Broker

- 同样的，请参考Eclipse的[官方指导](https://mosquitto.org/download/)安装Mosquito

- 安装完成后您可以通过`sudo systemctl start mosquito`等方式启动它（各类发行版的具体指令不同）

- 启动成功后您可以通过

    ```bash
    netstat -plant | grep 1883
    # tcp        0      0 0.0.0.0:1883            0.0.0.0:*               LISTEN      9460/mosquitto
    # tcp        0      0 127.0.0.1:1883          127.0.0.1:57688         ESTABLISHED 9460/mosquitto
    # tcp6       0      0 :::1883                 :::*                    LISTEN      9460/mosquitto
    ```

    来观察Mosquito是否已经在正常监听1883端口

#### JRE/JDK Java

项目使用Java与Spring-Boot进行后端部署，我们使用OpenJDK 16进行开发

- 您需要至少安装Java SE 16，[Oracle的官网提供了相关安装地址](https://www.oracle.com/java/technologies/javase-downloads.html)

- 同时，若您希望检查并修改我们的具体实现，您需要安装[OpenJDK 16](https://jdk.java.net/16/)

- 您可以通过

    ```bash
    java --version
    # java 16.0.1 2021-04-20
    # Java(TM) SE Runtime Environment (build 16.0.1+9-24)
    # Java HotSpot(TM) 64-Bit Server VM (build 16.0.1+9-24, mixed mode, sharing)
    ```

    来检查Java是否被正确安装了

### 运行部署

我们分别在`iotserver-front`和`iotserver`提供了可供直接运行的前后端

- 后端程序通过Spring-Boot管理，无需额外配置

- 但由于前端内容使用React进行完全动态页面跳转，需要您对您最喜爱的服务器进行简单配置

    我们推荐您使用`npm`提供的`serve`包来预览

#### NPM安装

您可以参考[这篇文章](https://www.freecodecamp.org/news/how-to-install-node-js-on-ubuntu-and-update-npm-to-the-latest-version/)来安装Node和npm

- 安装成功后您应该可以通过如下指令进行验证

    ```bash
    node -v
    # v14.17.1
    npm -v
    # 6.14.13
    ```

#### 后端部署

- 我们将在`iotserver/build/`中提供已经提前编译好的后端框架，您可以通过

    ```bash
    java -jar iotserver/build/iotserver-0.0.1-SNAPSHOT.jar
    ```

    来运行该框架

- 若正常运行，您应该能看到一些调试信息

    ```bash
     :: Spring Boot ::                (v2.5.0)                                                                                                                                                                                                                2021-06-29 21:55:00.423  INFO 14060 --- [           main] c.n.iotserver.IoTServerApplication       : Starting IoTServerApplication v0.0.1-SNAPSHOT using Java 16.0.1 on neon-cubes-1.localdomain with PID 14060 (/root/iotserver-0.0.1-SNAPSHOT.jar started by root in /root)
    ...
    2021-06-29 21:55:29.673  INFO 14060 --- [           main] o.s.b.a.ApplicationAvailabilityBean      : Application availability state ReadinessState changed to ACCEPTING_TRAFFIC
    2021-06-29 21:55:29.674  INFO 14060 --- [           main] c.n.iotserver.IoTServerApplication       : The main program has started
    ```

- 这意味着我们的后端已经成功在`localhost:8080`运行

- 您可以尝试访问http://localhost:8080/api/account/auth，如果您看到`You're not logged in.`

    说明服务器已经在正常运行



#### 前端部署

相信您已经安装了`npm`

- 我们需要创建一个简单的服务器，您可以通过`npm install -g serve`来安装`serve`

- 在`iotserver-front/build`中我们提供了预编译的前端（并配置了`api`接口为`localhost:8080`）

- 您可以通过如下指令来启动`iotserver-front`

    ```bash
    serve -s build
    #
    #  ┌───────────────────────────────────┐
    #  │                                   │
    #  │   Serving!                        │
    #  │                                   │
    #  │   Local:  http://localhost:5000   │
    #  │                                   │
    #  └───────────────────────────────────┘
    ```

- 此时，您可以通过浏览器访问http://localhost:5000来观察前端是否正常运行

#### Demo服务器

若上述步骤中出现了问题，您可以直接到https://neon-cubes.xyz:5001/来观看我们的项目演示



### 使用手册与功能测试

#### 注册账户

在浏览器访问`iotserver`后，您将首先看到登录的主界面

![image-20210629225339775](README.assets/image-20210629225339775.png)

由于您当前还未申请账号，我们可以点击Register Account来申请一个新的账号

![image-20210629225548829](README.assets/image-20210629225548829.png)

您可以在输入框中输入您的邮箱，输入框支持浏览器的智能提示，因此您此前在其他网站注册留下的模式会得到相应的提示与自动补全

![image-20210629225718051](README.assets/image-20210629225718051.png)

您可以通过下拉框来选择将要注册的用户类型，这里我们选择普通用户

![image-20210629225735450](README.assets/image-20210629225735450.png)

我们对邮箱的格式进行了检查，不满足正常邮箱的输入会被标红提示

![image-20210629225829471](README.assets/image-20210629225829471.png)

我们对用户输入的密码也进行了检查，要求字符数不少于8位，同时注册时的密码确认和输入密码要一致

![image-20210629230027808](README.assets/image-20210629230027808.png)

若用户有输入框没有填写完成就进行注册，我们会给予相应提示

![image-20210629230135821](README.assets/image-20210629230135821.png)

同时，我们提供了是否显示已经输入的密码的选择框

![image-20210629230215069](README.assets/image-20210629230215069.png)

注意，由于我们已经成功在数据库中插入了数据，这里使用这组属性进行注册时，`iotserver`会发现该用户的邮箱和我们已经注册过的一个用户重复了，于是拒绝进行注册

我们预先提供的测试账户是：

- 3180105504@zju.edu.cn
- 88888888

![image-20210629230502702](README.assets/image-20210629230502702.png)

让我们换一个邮箱进行注册

![image-20210629230517389](README.assets/image-20210629230517389.png)

成功了，并跳转到登陆界面

![image-20210629230556628](README.assets/image-20210629230556628.png)

#### 登陆账户

让我们尝试登录刚刚注册过的账户

这里同样会进行邮箱格式的检查并提示用户输入的邮箱格式不正确

![image-20210629230635415](README.assets/image-20210629230635415.png)

当我们尝试登陆并未注册过的账号时，`iotserver`将会拒绝登录并给出提示

![image-20210629230704141](README.assets/image-20210629230704141.png)

![image-20210629230743308](README.assets/image-20210629230743308.png)

我们设计了加载界面，让用户能清晰地认识到自己当前的进度，并判断卡顿是否来源于网络连接

![image-20210629230913266](README.assets/image-20210629230913266.png)

同时，我们支持在输入邮箱后直接敲击回车进入下一阶段

![image-20210629230958782](README.assets/image-20210629230958782.png)

输入密码时，我们同样提供了是否显示密码的选择框

![image-20210629231023343](README.assets/image-20210629231023343.png)

当输入密码不正确时，我们会提示用户

![image-20210629231047142](README.assets/image-20210629231047142.png)

#### 添加设备

登陆后我们会看到当前用户的设备管理主界面

![image-20210629231208257](README.assets/image-20210629231208257.png)

由于这个用户什么设备都没有添加过，我们将看不到任何设备，让我们来尝试添加设备

- 我们可以通过点击Start Editing来进入编辑模式，这样同时可以暂停数据的自动刷新

- 接着，点击Add Device按钮可以在设备管理表格中添加新的设备

- 双击进入单元格后可以修改设备相关属性

- 同时我们还支持标签化的标记不同的设备类型

- 新添加的，且未保存到云端的设备会以橙色底色显示

- 数据表的左侧选择栏可以让我们批量对设备进行创建/保存，删除的操作

- 修改完成后，我们可以点击Create来尝试添加设备

- 当添加遇到问题时，我们会提示用户，例如我们的第一个设备的MqttId和其他用户设备的MqttId重复了

    - 这里发生重复的原因在于我们配置使用环境时已经添加了一些设备

    - 要求MqttId全局唯一的原因在于服务器通过MqttId唯一标识所有设备的Mqtt通信

        不同用户的所有设备都将与Mosquito Broker通过Mqtt协议进行通信，而协议中的唯一身份辨识符就是MqttId

    - > The client identifier (ClientId) **identifies each MQTT client** that connects to an MQTT broker. The broker uses the ClientId to identify the client and the current state of the client.Therefore, this Id should be unique per client and broker. In MQTT 3.1.1 you can send an empty ClientId, if you don’t need a state to be held by the broker. The empty ClientId results in a connection without any state. In this case, the clean session flag must be set to true or the broker will reject the connection.

    - 为了让用户在Client端不做额外配置，我们希望用户使用全局唯一的Device MqttId

- 批量进行添加操作时，先出现的错误也不会影响其他实体的操作，同时相应的错误也会提示给用户

- 添加成功的设备以半透明黑色的底色表示，且Action栏的内容从Create变为Save

- 在第一次添加成功后，用户可以继续进行添加，编辑操作

- 添加成功后设备信息汇总表格会自动更新

    - 设备活动数据会显示当前用户所有设备的统计状态
    - 同时该用户设备数量也会立刻得到更新

![creation](README.assets/creation.gif)

#### 登陆状态

`iotserver`通过cookie来管理用户的登录状态

- 用户无操作静止一段时间后，登陆状态会失效，此时用户尝试访问主界面会看到访问被拒绝
- 同时，访问被拒后页面会自动倒计时5秒，结束后自动跳转到登陆界面让用户重新登陆

![access](README.assets/access.gif)

#### 登出账户

- 我们在个人账户信息栏下提供了登出当前账户的接口
- 登出后将会直接跳转到登陆界面

![logout](README.assets/logout.gif)

#### 修改设备

由于我们已经在数据库添加了一些演示数据，让我们直接登录数据库提供的账号

- 3180105504@zju.edu.cn
- 88888888

来观察修改数据的相关内容

- 修改设备同样支持批量操作
- 编辑任何单元格后`iotserver`都会用浅蓝色底色标记当前设备，表示用户对该设备进行了修改但还未保存到云端
- 批量操作后设备的Save按钮会变暗，表示保存成功，若出错则会弹出红色框提示用户

![modify](README.assets/modify.gif)

- 注意，修改设备的MqttId会让`iotserver`认为当前用户要创建一个新的设备
- 点击刷新后会发现该用户成功创建了一个新的设备

![modifytocreate](README.assets/modifytocreate.gif)

#### 删除设备

用户在选中设备后可以直接删除它们

- 类似的，删除操作也支持批量进行

- 值得注意的是，在各类批量操作中，我们进行的都是异步通信

    在BS体系应用下，网络环境往往是延迟的最大来源

    因此异步进行多个设备的操作可以大大减小用户等待时间

    一种更为优化的设计是，调整后端接口，对批量操作直接进行一次请求

![delete](README.assets/delete.gif)

#### 设备状态

为了看出设备状态变化，我们对`iotclient`做出了如下修改

- 添加了`maven` Wrapper生成工具

- 添加了connect, lastwill, disconnect三个状态变化的topic

- 添加了`mqttClient.close()`的清理工作

- 添加了随机下线的运行循环

    ```java
    firstmessage = false;
    if (lastmessage) {
        running = false;
        lastmessage = false;
    } else {
        // 0.1 to disconnect
        float RR = rand.nextFloat();
        if (RR < 0.1) {
            lastmessage = true;
        }
    }
    ```

- 修改了一些变量名以符合IoT的格式

- 修改了随即等待的时间为毫秒级别连续变化的

让我们在后台启动`iotclient`，在`iotclient/target`下会提供预编译好的`iotclient-1.0.0.jar`，可使用如下方式启动`iotclient`

注意

- `iotclient`要能够连接到`iotserver`的1883端口
- 若Mqtt Broker运行于服务器上，请将相关端口开放

```bash
java -jar iotclient/target/iotclient-1.0.0.jar
```

接着，让我们回到浏览器观察自己设备状态的变化

- 我们支持显示当前用户的在线设备数量/告警设备数量统计
- 我们支持用户所有设备传输的数据量
- 图表都以交互式SVG形式呈现给用户，界面友好
- 同时设备管理面板的设备状态也能及时呈现信息变化
    - 例如在线设备状态会得到及时更新
    - 告警设备的背景会变成透明红色以提示用户
    - 设备最近一次信息的摘要也可以在设备面板得到展现

![realtimeupdate](README.assets/realtimeupdate.gif)

#### 设备数据

- 如上图所示，设备传输数据量可以在右侧图表中正确显示

- 同时，所有设备的传输数据量会在左侧图标以面积形式显示

- 并按照传输数据量进行Bump Area的排名

- 我们可以选择要显示的设备详细数据量时间范围

    - 若起止时间显示错误，还有正确错误信息提示

    - 同时可以修改设备活动统计的分辨率

        例如从今天上午11:20到11:30以30的分辨率呈现，便会统计每20秒内每个设备分别发送的数据量并进行排列呈现

- 日期选取器提供用户友好的交互支持，同时显示当前日期

- 时间选择器支持上午/下午的正确选择

![deviceactivity](README.assets/deviceactivity.gif)

