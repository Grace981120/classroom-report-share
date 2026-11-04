export const languageExpressionModel={
  pronunciation:{
    name:'发音',value:'良好',language:'普通话',validAudio:'67分24秒',reviewCount:3,
    evidence:[
      {id:'P03',start:'18:42',end:'18:49',speaker:'教师',status:'建议复核',quote:'接下来我们看一下卷积神经网络在图像识别中的作用。',context:'前文：教师从传统分类方法过渡到深度学习方法。后文：随后展示网络结构示意图并解释卷积核。',reason:'音频评测在该句返回低置信度，当前只有整句级定位，建议结合原音人工复核；不将转写文本作为发音证据。'},
      {id:'P07',start:'32:10',end:'32:18',speaker:'教师',status:'清晰',quote:'模型的泛化能力，需要在未见过的数据上检验。',context:'上下文：教师解释训练集与测试集的作用。',reason:'该片段音频评测稳定、语音边界完整；结果只支持本片段的发音观察，不推断教学内容质量。'}
    ],
    missing:'另有1处音频信噪比较低，无法稳定定位具体音节，保留为待复核。'
  },
  fluency:{
    name:'流利度',value:'优秀',eventCount:5,impactCount:3,
    evidence:[
      {id:'F04',start:'39:44',end:'39:55',speaker:'教师',status:'不当停顿',quote:'这个模型首先会……会提取图像特征，然后再完成分类。',highlight:'会……会',context:'前文：教师说明图像分类的基本流程。后文：继续解释特征层与分类层。',reason:'句中出现非语义需要的停顿并重复“会”，打断同一谓语结构；前后文未发现提问、强调或等待学生回应。'},
      {id:'F06',start:'51:20',end:'51:29',speaker:'教师',status:'教学留白',quote:'如果训练数据本身有偏差，模型的结果会怎么样？',context:'后续4秒：学生开始回答“可能会把偏差放大”。',reason:'停顿位于完整问题之后并承接学生回答，应视为候答时间，不计入语言不流利。'},
      {id:'F08',start:'63:08',end:'63:16',speaker:'教师',status:'卡顿/重复',quote:'我们从这个、这个例子里，可以看到数据质量的重要性。',highlight:'这个、这个',context:'上下文：教师总结医疗诊断案例。',reason:'短时间内重复指示词，未承担强调或结构提示作用；只记录可观察表达现象，不推断教师整体语言能力。'}
    ]
  }
};
