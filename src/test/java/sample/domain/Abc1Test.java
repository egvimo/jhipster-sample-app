package sample.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import sample.web.rest.TestUtil;

class Abc1Test {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Abc1.class);
        Abc1 abc11 = new Abc1();
        abc11.setId(1L);
        Abc1 abc12 = new Abc1();
        abc12.setId(abc11.getId());
        assertThat(abc11).isEqualTo(abc12);
        abc12.setId(2L);
        assertThat(abc11).isNotEqualTo(abc12);
        abc11.setId(null);
        assertThat(abc11).isNotEqualTo(abc12);
    }
}
