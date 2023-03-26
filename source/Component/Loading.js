/* Importações React */
import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

/* Importações Plugins */
import Modal from 'react-native-modal';

export default class Loading extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            numberOfDots: 3,
            minOpacity: 0.25,
            animationDelay: 120,
            style: {
                color: '#3D5375',
                fontSize: 100
            }
        };

        this._animation_state = {
            dot_opacities: this.initializeDots(),
            target_opacity: 1,
            should_animate: true,
        };
    }

    initializeDots() {
        let opacities = [];

        for (let i = 0; i < this.state.numberOfDots; i++) {
            let dot = new Animated.Value(this.state.minOpacity);
            opacities.push(dot);
        }

        return opacities;
    }

    componentDidMount() {
        this.animate_dots.bind(this)(0);
    }

    componentWillUnmount() {
        this._animation_state.should_animate = false;
    }

    animate_dots(which_dot) {
        if (!this._animation_state.should_animate) return;

        // swap fade direction when we hit end of list
        if (which_dot >= this._animation_state.dot_opacities.length) {
            which_dot = 0;
            let min = this.state.minOpacity;
            this._animation_state.target_opacity =
                this._animation_state.target_opacity == min ? 1 : min;
        }

        let next_dot = which_dot + 1;

        Animated.timing(this._animation_state.dot_opacities[which_dot], {
            toValue: this._animation_state.target_opacity,
            duration: this.state.animationDelay,
            useNativeDriver: false
        }).start(this.animate_dots.bind(this, next_dot));
    }

    _renderText() {
        if (this.props.text) {
            return (
                <Text style={styles.text}>{this.props.text}</Text>
            );
        }
    }

    render() {
        let dots = this._animation_state.dot_opacities.map((o, i) =>
            <Animated.View key={i} style={[styles.indicator, { opacity: o }]}></Animated.View>
        );
        return (
            <View>
                <Modal isVisible={this.props.show} backdropColor="white" backdropOpacity={0.85}
                    animationIn="fadeIn" animationOut="fadeOut">
                    <View style={styles.container}>
                        <View style={styles.popup}>
                            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>{dots}</View>
                            <Text style={styles.text}>{this.props.text ? (this.props.text) : ('YodPro')}</Text>
                        </View>
                    </View>
                 </Modal>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center' },
    popup: { paddingTop: 50, paddingBottom: 40, marginHorizontal: 40, borderRadius: 6 },
    text: { textAlign: 'center', marginTop: 20, color: '#777', fontWeight: '500', fontSize: 18 },
    indicator: { width: 16, height: 16, borderRadius: 8, marginHorizontal: 5, backgroundColor: '#291286' },
});