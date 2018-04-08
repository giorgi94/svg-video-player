SVGVideoPlayer = (wrapper) ->
    @el = document.querySelector(wrapper)
    @svg = @el.querySelector('svg')
    @video = @el.querySelector('video')

    @bottomGroup = @svg.querySelector('.bottom-controls')

    @buttons =
        play: @svg.querySelector('.play--group')
        time:
            rect: @svg.querySelector('.btn--time')
            text: @svg.querySelector('.text--time')
        progress:
            group: @svg.querySelector('.progress--group')
            panel: @svg.querySelector('.progress--panel')
        fullscreen: @svg.querySelector('.fullscreen--group')


    @init()

    { el: this }

SVGVideoPlayer::init = ->
    @set_constants()
    @resize()

    @video.addEventListener 'resize', @resize.bind(this)
    @video.addEventListener 'canplay', @resize.bind(this)

    @svg.addEventListener 'click', ((event)->
        if event.target.tagName == 'svg'
            @play()
        ).bind(this)


    window.addEventListener 'resize', @resize.bind(this)
    @events()

    @set_duration()

    @svg.setAttribute('width', '500px')
    setTimeout((()=>@svg.removeAttribute('width')),5)

SVGVideoPlayer::set_constants = ->
    svg_rect = @svg.getBoundingClientRect()
    play_rect = @buttons.play.getBoundingClientRect()
    time_rect = @buttons.time.rect.getBoundingClientRect()
    fullscreen_rect = @buttons.fullscreen.getBoundingClientRect()

    @const =
        btn_margin_outer: play_rect.x - svg_rect.x
        btn_margin_inner: fullscreen_rect.x - time_rect.x - time_rect.width
        btn_time_width: time_rect.width
        btn_default_width: play_rect.width


SVGVideoPlayer::resize = ->
    rect = @el.getBoundingClientRect()
    @svg.setAttribute 'viewBox', "0 0 #{rect.width} #{rect.height}"
    @bottomGroup.style.transform = "translateY(#{rect.height - 55}px)"
    @buttons.progress.panel.style.width = "#{rect.width - (2*@const.btn_default_width + @const.btn_time_width + 2*@const.btn_margin_outer + 3*@const.btn_margin_inner)}px"



SVGVideoPlayer::events = ->
    @buttons.play.addEventListener 'click', @play.bind(this)
    @video.addEventListener 'timeupdate', @timeUpdate.bind(this)


SVGVideoPlayer::play = ->
    if @video.paused
        @video.play()
        @toggle_play_animation('play')
    else
        @video.pause()
        @toggle_play_animation('pause')

SVGVideoPlayer::pause = ->
    if not @video.paused
        @video.pause()
        @toggle_play_animation('pause')

SVGVideoPlayer::toggle_play_animation = (mode)->
    btn = @buttons.play

    if mode == 'pause'
        anims = btn.querySelectorAll('.animate-to-play')
        for anim in anims
            anim.beginElement()
    else
        btn.querySelector('.animate-to-pause-right').beginElement()
        btn.querySelector('.animate-to-pause-left').beginElement()

SVGVideoPlayer::set_duration = ->
    if isNaN(@video.duration)
        setTimeout((()=>@set_duration()), 20);
    else
        @buttons.time.text.innerHTML = @seconds_to_time(@video.duration)


SVGVideoPlayer::seconds_to_time = (seconds) ->
    minutes = Math.floor(seconds/60)
    seconds = Math.round(seconds-60*minutes)

    if minutes<10
        minutes = '0' + minutes
    if seconds<10
        seconds = '0' + seconds
    return minutes + ':' + seconds

SVGVideoPlayer::timeUpdate = ->
    8










window.SVGVideoPlayer = SVGVideoPlayer
